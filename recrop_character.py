from PIL import Image

page7_path = "C:/Users/peter/.gemini/antigravity-ide/scratch/suggestive-line-web/assets/page_7.png"
output_dest = "C:/Users/peter/.gemini/antigravity-ide/scratch/suggestive-line-web/assets/hero_character.png"

img = Image.open(page7_path)

# Crop the character using a smaller vertical height to avoid capturing the 'SO I BECOME' text underneath
x1, y1 = 114, 242
x2, y2 = 999, 720 # stopped before the text and secondary illustration starts

cropped = img.crop((x1, y1, x2, y2))
cropped.save(output_dest)
print(f"Saved clean character image (excluding text): {output_dest} ({cropped.size})")
