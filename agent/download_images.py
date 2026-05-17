import os
import requests

# Direct CDN paths
IMAGES = {
    "narendra_modi.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Narendra_Modi.jpg",
    "raj_shamani.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Raj_Shamani.jpg",
    "ratan_tata.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Ratan_Tata.jpg"
}

# Target directory in Next.js public folder
target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "web", "public", "creators"))
os.makedirs(target_dir, exist_ok=True)

print(f"Downloading images to local directory: {target_dir}")

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

for filename, url in IMAGES.items():
    filepath = os.path.join(target_dir, filename)
    print(f"Downloading {filename}...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        with open(filepath, "wb") as f:
            f.write(response.content)
        print(f"Successfully saved to {filepath}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")

print("Done!")
