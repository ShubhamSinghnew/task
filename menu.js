
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const MENU_FILE = path.join(__dirname, "menu.json");

// const MARKUP = 15;

// const ITEMS = [
//     ["Veg. Frankie", "Classic", 35],
//     ["Veg. Schezwan Frankie", "Schezwan", 40],
//     ["Veg. Noodles Frankie", "Noodles", 50],
//     ["Pasta Frankie", "Classic", 60],
//     ["Veg. Tandoori Frankie", "Classic", 60],
//     ["Veg. Peri Peri Frankie", "Classic", 60],
//     ["Manchurian Frankie", "Manchurian", 60],
//     ["Veg. Pizza Frankie", "Classic", 60],
//     ["Veg. Schezwan Mayo Frankie", "Schezwan", 60],
//     ["Veg. Schezwan Cheese Frankie", "Schezwan", 70],
//     ["Veg. Schezwan Manchurian Frankie", "Manchurian", 60],
//     ["Veg. Schezwan Noodles Frankie", "Noodles", 80],
//     ["Paneer Frankie", "Paneer", 80],
//     ["Veg. Schezwan Paneer Frankie", "Paneer", 80],
//     ["Veg. Schezwan Mayo Cheese Frankie", "Schezwan", 80],
//     ["Veg. Schezwan Manchurian Cheese Frankie", "Manchurian", 80],
//     ["Veg. Schezwan Noodles Cheese Frankie", "Noodles", 80],
//     ["Veg. Schezwan Mayo Noodles Frankie", "Noodles", 80],
//     ["Veg. Schezwan Mayo Manchurian Frankie", "Manchurian", 80],
//     ["Veg. Schezwan Noodles Manchurian Frankie", "Manchurian", 80],
//     ["Veg. Schezwan Paneer Cheese Frankie", "Paneer", 100],
//     ["Veg. All in One Frankie", "Special", 120]
// ];

// function slug(str) {
//     return str.toLowerCase()
//         .replace(/[^a-z0-9]+/g, "_")
//         .replace(/^_+|_+$/g, "");
// }

// function aliases(name) {
//     const low = name.toLowerCase().replace(/\./g, "");

//     const short = low.startsWith("veg ")
//         ? low.replace(/^veg /, "")
//         : low;

//     const out = new Set([low, short]);

//     for (const a of [...out]) {
//         out.add(a.replace(/schezwan/g, "shezwan"));
//         out.add(a.replace(/schezwan/g, "schezuan"));
//         out.add(a.replace(/schezwan/g, "szechuan"));
//     }

//     for (const a of [...out]) {
//         out.add(a.replace(/frankie/g, "franki"));
//         out.add(a.replace(/frankie/g, "frankey"));
//     }

//     return [...out].sort();
// }

// // Existing menu read karo
// let oldMenu = [];

// if (fs.existsSync(MENU_FILE)) {
//     oldMenu = JSON.parse(fs.readFileSync(MENU_FILE, "utf8"));
// }

// // Existing photo fields ko ID ke according preserve karo
// const oldPhotos = new Map(
//     oldMenu.map(item => [item.id, item.photo])
// );

// // Generate updated menu
// const menu = ITEMS.map(([name, category, base], index) => ({
//     id: index + 1,
//     name,
//     category,
//     veg: true,
//     base_price: base,
//     price: base + MARKUP,
//     available: true,

//     // Existing photo URL/filename preserve hoga
//     photo: oldPhotos.get(index + 1) || `${slug(name)}.jpg`,

//     aliases: aliases(name)
// }));

// fs.writeFileSync(
//     MENU_FILE,
//     JSON.stringify(menu, null, 2),
//     "utf8"
// );

// console.log(`${menu.length} items updated.`);
// console.log("Existing photo fields preserved.");

// export default menu;



import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MENU_FILE = path.join(__dirname, "app", "data", "menu.json");

// Wahi array object hamesha rehta hai, isliye purana `import menu from "./menu.js"` chalta rahega
const menu = [];

export function loadMenu() {
  try {
    const raw = fs.readFileSync(MENU_FILE, "utf8").trim();
    if (!raw) throw new Error("menu.json khali hai");

    const data = JSON.parse(raw);
    const list = Array.isArray(data) ? data : data.items || [];
    if (!list.length) throw new Error("menu.json me koi item nahi");

    menu.splice(0, menu.length, ...list);
    console.log("Menu loaded:", menu.length, "items");
  } catch (e) {
    console.error("Menu load fail, purana menu chal raha hai:", e.message);
  }
  return menu;
}

export const getMenu = () => menu;
export const getItem = (id) => menu.find((i) => Number(i.id) === Number(id));

loadMenu();          // sirf padhta hai, kuch likhta nahi
export default menu;