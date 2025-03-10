import requests
from bs4 import BeautifulSoup
import json
import time
from google.colab import files, drive

# List of all districts in Bangladesh
districts = [
    "coxsbazar", "kishoreganj", "kurigram", "cumilla", "kushtia", "khagrachhari", "khulna", "gaibandha",
    "gazipur", "gopalganj", "chattogram", "chandpur", "chapainawabganj", "chuadanga", "joypurhat",
    "jamalpur", "jhalokati", "jhenaidah", "tangail", "thakurgaon", "dhaka", "dinajpur", "naogaon",
    "narail", "narsingdi", "natore", "narayanganj", "nilphamari", "netrokona", "noakhali", "panchagarh",
    "patuakhali", "pabna", "pirojpur", "faridpur", "feni", "bogura", "barguna", "barishal", "bagerhat",
    "bandarban", "brahmanbaria", "bhola", "magura", "madaripur", "manikganj", "munshiganj", "meherpur",
    "maulvibazar", "mymensingh", "jashore", "rangpur", "rangamati", "rajbari", "rajshahi", "lakshmipur",
    "lalmonirhat", "shariatpur", "sherpur", "satkhira", "sirajganj", "sylhet", "sunamganj", "habiganj"
]

# Base URL for fetching the data
BASE_URL = "https://www.emythmakers.com/namaz/en/month/March/district/"

# Dictionary to store the prayer times for all districts
all_districts_data = {}

# Loop through each district and scrape data
for district in districts:
    url = BASE_URL + district
    print(f"Scraping: {district} -> {url}")

    try:
        # Fetch page content
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()  # Raise an error if request fails

        # Parse HTML content
        soup = BeautifulSoup(response.text, "html.parser")
        table = soup.find("table")

        if not table:
            print(f"❌ No table found for {district}")
            continue

        # Extract table headers
        headers = [th.text.strip() for th in table.find_all("th")]

        # Extract table rows
        data = []
        for row in table.find_all("tr")[1:]:  # Skip the header row
            cells = row.find_all("td")
            data.append({headers[i]: cells[i].text.strip() for i in range(len(cells))})

        # Save data for the district
        all_districts_data[district] = data

        # Add delay to avoid being blocked
        time.sleep(1)

    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error fetching data for {district}: {e}")

# Save the scraped data as a JSON file
json_filename = "namaz_schedule_2025.json"
with open(json_filename, "w", encoding="utf-8") as f:
    json.dump(all_districts_data, f, ensure_ascii=False, indent=4)

print(f"✅ JSON file created successfully: {json_filename}")

# --- Option 1: Download JSON file in Colab ---
files.download(json_filename)

# --- Option 2: Save JSON to Google Drive ---
drive.mount('/content/drive')  # Mount Google Drive
drive_path = "/content/drive/My Drive/" + json_filename
with open(drive_path, "w", encoding="utf-8") as f:
    json.dump(all_districts_data, f, ensure_ascii=False, indent=4)

print(f"✅ JSON file also saved in Google Drive: {drive_path}")
