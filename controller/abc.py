import pandas as pd

# Preparing the data for each district in the respective provinces
data = {
    "Northern Province, Bombali District": [
        {"District": "Bombali Sebora", "Chiefdom": "Makeni"},
        {"District": "Bombali Siaray", "Chiefdom": "-"},
        {"District": "Makari", "Chiefdom": "-"},
        {"District": "Gbanti", "Chiefdom": "-"},
        {"District": "Paki Masabong", "Chiefdom": "Mapaki"},
        {"District": "Safroko Limba", "Chiefdom": "Binkolo"},
        {"District": "Biriwa Limba", "Chiefdom": "Kamabai"},
        {"District": "Gbendembu", "Chiefdom": "-"},
        {"District": "Ngowahun", "Chiefdom": "-"},
        {"District": "Magbaiamba-Ndowahun", "Chiefdom": "Hunduwa"},
        {"District": "Kamaranka", "Chiefdom": "Kamaranka"},
        {"District": "Mara", "Chiefdom": "-"}
    ],
    "Northern Province, Falaba District": [
        {"District": "Neya", "Chiefdom": "Krubola"},
        {"District": "Nyedu", "Chiefdom": "-"},
        {"District": "Kulor-Seradu", "Chiefdom": "-"},
        {"District": "Mongo", "Chiefdom": "Bendugu"},
        {"District": "Seradu", "Chiefdom": "-"},
        {"District": "Morifindugu", "Chiefdom": "-"},
        {"District": "Delemandugu", "Chiefdom": "-"},
        {"District": "Sulima", "Chiefdom": "Falaba"},
        {"District": "Kabelia", "Chiefdom": "-"},
        {"District": "Folasaba-Kamba", "Chiefdom": "-"},
        {"District": "Dembelia Musaia", "Chiefdom": "-"},
        {"District": "Dembelia Sikunia", "Chiefdom": "Sikunia"},
        {"District": "Kamadugu-Yiraia", "Chiefdom": "-"}
    ],
    "Northern Province, Koinadugu District II": [
        {"District": "Wara-Wara Bafodia", "Chiefdom": "Bafodea"},
        {"District": "Kamukeh", "Chiefdom": "-"},
        {"District": "Sengbe", "Chiefdom": "Yogomaia"},
        {"District": "Wara-Wara Yagalla", "Chiefdom": "Gbawuria"},
        {"District": "Diang", "Chiefdom": "Kondembaia"},
        {"District": "Kasunko-Kakellay", "Chiefdom": "-"},
        {"District": "Gbongobor-Kayaka", "Chiefdom": "-"},
        {"District": "Thamiso", "Chiefdom": "-"},
        {"District": "Neini", "Chiefdom": "Yiffin"},
        {"District": "Kallian", "Chiefdom": "-"},
        {"District": "Barawa-Wolley", "Chiefdom": "-"}
    ],
    "Northern Province, Tonkolili District": [
        {"District": "Dansogoia", "Chiefdom": "-"},
        {"District": "Kalantuba", "Chiefdom": "-"},
        {"District": "Kafe", "Chiefdom": "-"},
        {"District": "Simiria", "Chiefdom": "-"},
        {"District": "Kholifa Rowala", "Chiefdom": "-"},
        {"District": "Tane", "Chiefdom": "Matotoka"},
        {"District": "Kunike Gbarnga", "Chiefdom": "-"},
        {"District": "Kholifa Mayosso-Mamuntha", "Chiefdom": "-"},
        {"District": "Kunike Sanda", "Chiefdom": "-"},
        {"District": "Kunike Folawusu", "Chiefdom": "-"},
        {"District": "Yele", "Chiefdom": "-"},
        {"District": "Mayeppoh", "Chiefdom": "-"},
        {"District": "Poli", "Chiefdom": "-"},
        {"District": "Masakong", "Chiefdom": "-"},
        {"District": "Yoni Mabanta", "Chiefdom": "-"},
        {"District": "Yoni Mamailla", "Chiefdom": "-"},
        {"District": "Kholifa Mabang", "Chiefdom": "-"},
        {"District": "Malal", "Chiefdom": "-"},
        {"District": "Sambaia", "Chiefdom": "Bendugu"}
    ],
    "Northwestern Province, Kambia District": [
        {"District": "Magbema", "Chiefdom": "Kambia"},
        {"District": "Mambolo", "Chiefdom": "Mambolo"},
        {"District": "Samu", "Chiefdom": "Kychum"},
        {"District": "Gbinle", "Chiefdom": "-"},
        {"District": "Dixon", "Chiefdom": "-"},
        {"District": "Tonko Limba", "Chiefdom": "Madina"},
        {"District": "Bramaia", "Chiefdom": "Kukuna"},
        {"District": "Khonimakha", "Chiefdom": "-"},
        {"District": "Masungbala", "Chiefdom": "Kawulia"},
        {"District": "Tala-Munu", "Chiefdom": "-"}
    ],
    "Northwestern Province, Port Loko District": [
        {"District": "Bureh", "Chiefdom": "-"},
        {"District": "Kasseh", "Chiefdom": "-"},
        {"District": "Maconteh", "Chiefdom": "-"},
        {"District": "Bake-Loko", "Chiefdom": "-"},
        {"District": "Maforki", "Chiefdom": "Port Loko"},
        {"District": "Lokomassama", "Chiefdom": "Petifu"},
        {"District": "Kamasondo", "Chiefdom": "-"},
        {"District": "Kaffu Bullom", "Chiefdom": "Mahera"},
        {"District": "Marampa", "Chiefdom": "Lunsar"},
        {"District": "Koya", "Chiefdom": "Songo"},
        {"District": "Masimera", "Chiefdom": "Masimera"},
        {"District": "Thainkatopa", "Chiefdom": "-"},
        {"District": "Makama", "Chiefdom": "-"}
    ],
    "Northwestern Province, Karene District": [
        {"District": "Tambakha Simibungie", "Chiefdom": "-"},
        {"District": "Tambakha Yobangie", "Chiefdom": "-"},
        {"District": "Gbanti", "Chiefdom": "-"},
        {"District": "Libeisaygahun-Gombagu", "Chiefdom": "Batkanu"},
        {"District": "Mafonda", "Chiefdom": "-"},
        {"District": "Makerembay", "Chiefdom": "-"},
        {"District": "Sanda Tendaren", "Chiefdom": "Mateboi"},
        {"District": "Sanda Magbolontor", "Chiefdom": "Sendugu"},
        {"District": "Sella Limba", "Chiefdom": "Kamakwie"},
        {"District": "Sanda Loko", "Chiefdom": "Kamalo"},
        {"District": "Buya", "Chiefdom": "-"},
        {"District": "Romende", "Chiefdom": "-"},
        {"District": "Safroko", "Chiefdom": "-"},
        {"District": "Dibia", "Chiefdom": "-"}
    ],
    "Southern Province, Bo District": [
        {"District": "Badja", "Chiefdom": "Ngelehun"},
        {"District": "Bagbe", "Chiefdom": "Ngarlu"},
        {"District": "Bagbo", "Chiefdom": "Jimmi"},
        {"District": "Baoma", "Chiefdom": "Baoma"},
        {"District": "Bumpe", "Chiefdom": "Bumpe"},
        {"District": "Gbo", "Chiefdom": "Gbo"},
        {"District": "Jaiama", "Chiefdom": "-"},
        {"District": "Bongor", "Chiefdom": "-"},
        {"District": "Kakua", "Chiefdom": "Kakua"},
        {"District": "Komboya", "Chiefdom": "Njala"},
        {"District": "Lugbu", "Chiefdom": "Sumbuya"},
        {"District": "Niawa-Lenga", "Chiefdom": "Nengbema"},
        {"District": "Selenga", "Chiefdom": "Dambala"},
        {"District": "Tikonko", "Chiefdom": "Tikonko"},
        {"District": "Valunia", "Chiefdom": "Mongere"},
        {"District": "Wonde", "Chiefdom": "Gboyama"}
    ],
    "Southern Province, Bonthe District": [
        {"District": "Bendu Cha", "Chiefdom": "Bendu"},
        {"District": "Bum", "Chiefdom": "Madina"},
        {"District": "Dema", "Chiefdom": "Tissana"},
        {"District": "Imperi", "Chiefdom": "Gbangbama"},
        {"District": "Jong", "Chiefdom": "Mattru"},
        {"District": "Kpanda-Kemo", "Chiefdom": "Motuo"},
        {"District": "Kwamebai Krim", "Chiefdom": "Benduma"},
        {"District": "Nongoba Bullom", "Chiefdom": "Gbap"},
        {"District": "Sittia", "Chiefdom": "Yonni"},
        {"District": "Sogbini", "Chiefdom": "Tihun"},
        {"District": "Yawbeko", "Chiefdom": "Talia"}
    ],
    "Southern Province, Moyamba District": [
        {"District": "Bagruwa", "Chiefdom": "Sembehun"},
        {"District": "Banta", "Chiefdom": "Gbangbantoke"},
        {"District": "Banta-Mokele", "Chiefdom": "Mokelle"},
        {"District": "Bumpe", "Chiefdom": "Rotifunk"},
        {"District": "Dasse", "Chiefdom": "Mano"},
        {"District": "Fakunya", "Chiefdom": "Gandohun"},
        {"District": "Kaiyamba", "Chiefdom": "Moyamba"},
        {"District": "Kagboro", "Chiefdom": "Shenge"},
        {"District": "Kamajei", "Chiefdom": "Senehun"},
        {"District": "Kongboro", "Chiefdom": "Bauya"},
        {"District": "Kori", "Chiefdom": "Taiama"},
        {"District": "Kowa", "Chiefdom": "Njama"},
        {"District": "Ribbi", "Chiefdom": "Bradford"},
        {"District": "Timdel", "Chiefdom": "Bomotoke"}
    ],
    "Southern Province, Pujehun District": [
        {"District": "Barri", "Chiefdom": "Potoru"},
        {"District": "Gallines", "Chiefdom": "-"},
        {"District": "Perri", "Chiefdom": "-"},
        {"District": "Kpaka", "Chiefdom": "Massam"},
        {"District": "Makpele", "Chiefdom": "Zimmi"},
        {"District": "Malen", "Chiefdom": "Sahn"},
        {"District": "Mano Sakrim", "Chiefdom": "Gbonjema"},
        {"District": "Kpanga", "Chiefdom": "Pujehun"},
        {"District": "Kabonde", "Chiefdom": "-"},
        {"District": "Kpanga-Krim", "Chiefdom": "Gobaru"},
        {"District": "Peje", "Chiefdom": "Futta"},
        {"District": "Soro Gbema", "Chiefdom": "Fairo"},
        {"District": "Sowa", "Chiefdom": "Bandajuma"},
        {"District": "Yekemo-Kpukumu-Krim", "Chiefdom": "Karlu"}
    ],
    "Eastern Province, Kailahun District": [
        {"District": "Dea", "Chiefdom": "Baiwala"},
        {"District": "Njaluahun", "Chiefdom": "Segbwema"},
        {"District": "Kissi Kama", "Chiefdom": "Dea"},
        {"District": "Kissi Teng", "Chiefdom": "Kangama"},
        {"District": "Kissi Tongi", "Chiefdom": "Buedu"},
        {"District": "Jawei", "Chiefdom": "Daru"},
        {"District": "Luawa", "Chiefdom": "Kailahun"},
        {"District": "Malema", "Chiefdom": "Jojoima"},
        {"District": "Mandu", "Chiefdom": "Mobai"},
        {"District": "Peje West", "Chiefdom": "Bunumbu"},
        {"District": "Penguia", "Chiefdom": "Sandaru"},
        {"District": "Upper Bambara", "Chiefdom": "Pendembu"},
        {"District": "Kpeje Bongre", "Chiefdom": "Manowa"},
        {"District": "Yawei", "Chiefdom": "Bandajuma"}
    ],
    "Eastern Province, Kenema District": [
        {"District": "Dama", "Chiefdom": "Giema"},
        {"District": "Dodo", "Chiefdom": "Dodo"},
        {"District": "Gaura", "Chiefdom": "Joru"},
        {"District": "Gorama Mende", "Chiefdom": "Tungie"},
        {"District": "Kandu Leppiama", "Chiefdom": "Gbado"},
        {"District": "Koya", "Chiefdom": "Baoma"},
        {"District": "Langrama", "Chiefdom": "Ya Baima"},
        {"District": "Lower Bambara", "Chiefdom": "Panguma"},
        {"District": "Malegohun", "Chiefdom": "Sembehun"},
        {"District": "Niawa", "Chiefdom": "Sundumei"},
        {"District": "Nomo", "Chiefdom": "Faama"},
        {"District": "Nongowa", "Chiefdom": "Kenema"},
        {"District": "Simbaru", "Chiefdom": "Boajibu"},
        {"District": "Small Bo", "Chiefdom": "Blama"},
        {"District": "Tunkia", "Chiefdom": "Gorahun"},
        {"District": "Wando", "Chiefdom": "Faala"}
    ],
    "Eastern Province, Kono District": [
        {"District": "Tankoro", "Chiefdom": "New Sembehun"},
        {"District": "Gbense", "Chiefdom": "Yardu"},
        {"District": "Kama'a", "Chiefdom": "Tombodu"},
        {"District": "Nimikoro", "Chiefdom": "Njaiama"},
        {"District": "Nimiyama", "Chiefdom": "Sewafe"},
        {"District": "Sandor", "Chiefdom": "Kayima"},
        {"District": "Toli", "Chiefdom": "Kondewakor"},
        {"District": "Gbane", "Chiefdom": "Ngandorhun"},
        {"District": "Lei", "Chiefdom": "Siama"},
        {"District": "Soa", "Chiefdom": "Kainkordu"},
        {"District": "Fiama", "Chiefdom": "Njagbwema"},
        {"District": "Gorama Kono", "Chiefdom": "Kangama"},
        {"District": "Mafindor", "Chiefdom": "Kamiendor"},
        {"District": "Gbane Kandor", "Chiefdom": "Koardu"}
    ]
}

# Creating a DataFrame for each province and district
dfs = []

for province_district, entries in data.items():
    province, district = province_district.split(", ")
    for entry in entries:
        dfs.append({
            "Province": province,
            "District": district,
            "Chiefdom": entry["District"],
            "Headquarter": entry["Chiefdom"]
        })

# Convert the list of dictionaries into a DataFrame
df = pd.DataFrame(dfs)

# Save the DataFrame to an Excel file
file_path = "/mnt/data/Sierra_Leone_Administrative_Divisions.xlsx"
df.to_excel(file_path, index=False)

file_path