
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MENU_FILE = path.join(__dirname, "menu.json");
const API = "https://commons.wikimedia.org/w/api.php";

const usedImages = new Set();

async function findImage(query) {
    const params = new URLSearchParams({
        action: "query",
        format: "json",
        generator: "search",
        gsrsearch: `${query} filetype:bitmap`,
        gsrnamespace: "6",
        gsrlimit: "50",
        prop: "imageinfo",
        iiprop: "url|mime",
        iiurlwidth: "600"
    });

    const response = await fetch(`${API}?${params}`, {
        headers: {
            "User-Agent": "FrankieMenuPhotoSearch/1.0"
        }
    });

    if (!response.ok) {
        throw new Error(`Wikimedia error: ${response.status}`);
    }

    const result = await response.json();
    const pages = Object.values(result.query?.pages || {});

    for (const page of pages.sort((a, b) => a.index - b.index)) {
        const info = page.imageinfo?.[0];

        if (
            info?.mime?.startsWith("image/") &&
            info.thumburl &&
            !usedImages.has(info.thumburl)
        ) {
            return info.thumburl;
        }
    }

    return null;
}

async function updateMenuPhotos() {
    const menuJson = JSON.parse(
        fs.readFileSync(MENU_FILE, "utf8")
    );

    const menu = Array.isArray(menuJson)
        ? menuJson
        : menuJson.data || [];

    for (const item of menu) {
        console.log("\nSearching:", item.name);

        // Name + aliases se search terms banana
        const searchTerms = [
            `${item.name} Indian food`,
            `${item.name} food`,
            ...(Array.isArray(item.aliases) ? item.aliases : [])
        ];

        let imageUrl = null;

        for (const term of [...new Set(searchTerms)]) {
            if (!term) continue;

            console.log("Trying:", term);

            try {
                imageUrl = await findImage(term);

                if (imageUrl) {
                    console.log("Image found using:", term);
                    break;
                }
            } catch (error) {
                console.log("Search error:", error.message);
            }

            await new Promise(resolve => setTimeout(resolve, 300));
        }

        if (imageUrl) {
            item.photo = imageUrl;
            usedImages.add(imageUrl);

            console.log("Updated:", item.name, imageUrl);
        } else {
            console.log("No unique image found:", item.name);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    fs.writeFileSync(
        MENU_FILE,
        JSON.stringify(menuJson, null, 2),
        "utf8"
    );

    console.log("\n========== RESULT ==========");
    console.log("Total items:", menu.length);
    console.log("Unique photos:", usedImages.size);
    console.log("Items without new photo:", menu.filter(item =>
        !item.photo
    ).map(item => item.name));
}

export default updateMenuPhotos;

// Run:
// updateMenuPhotos();
