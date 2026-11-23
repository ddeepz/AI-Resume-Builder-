"""
Process the NEW robot image:
1. It's already transparent (RGBA PNG on black background)
2. Resize to appropriate hero size
3. Add cyan/blue holographic glow
4. Add floating particle accents
5. Save as the final robot images
"""
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

SRC = "/home/z/my-project/upload/Robot without background.png"
OUT = "/home/z/my-project/public/ai-robot.png"
OUT_GLOW = "/home/z/my-project/public/ai-robot-glow.png"

img = Image.open(SRC).convert("RGBA")
print(f"Original size: {img.size}")

# The image is 1227x1281 - resize to a reasonable size for web
# Keep aspect ratio, target around 500px height
target_h = 500
ratio = target_h / img.size[1]
target_w = int(img.size[0] * ratio)
img = img.resize((target_w, target_h), Image.LANCZOS)
print(f"Resized to: {img.size}")

# Check and clean up any residual black/dark background pixels
# (the image was on a black background originally)
arr = np.array(img)
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

# Find pixels that are very dark AND semi-transparent (remnants of black bg)
# These should be fully transparent
dark_mask = (r < 30) & (g < 30) & (b < 30) & (a > 0) & (a < 100)
arr[dark_mask] = [0, 0, 0, 0]

# Find pixels that are very dark AND fully opaque (might be black bg remnants)
dark_opaque = (r < 20) & (g < 20) & (b < 20) & (a > 200)
# Check if these are likely background (edges) vs robot parts (like the screen face)
# The robot's face screen is dark but has glowing eyes - keep dark pixels that have bright neighbors
# For simplicity, make very dark opaque pixels at the edges transparent
# Check distance from center - if far from center and very dark, it's background
h, w = arr.shape[:2]
cy, cx = h // 2, w // 2
y_coords, x_coords = np.ogrid[:h, :w]
dist_from_center = np.sqrt((y_coords - cy)**2 + (x_coords - cx)**2)
max_dist = min(h, w) / 2
edge_dark = dark_opaque & (dist_from_center > max_dist * 0.7)
arr[edge_dark] = [0, 0, 0, 0]

img = Image.fromarray(arr)

# Enhance colors slightly
enhancer = ImageEnhance.Color(img)
img = enhancer.enhance(1.1)
enhancer = ImageEnhance.Brightness(img)
img = enhancer.enhance(1.05)

# Save the base transparent robot
img.save(OUT, "PNG")
print(f"Saved base robot to {OUT}, size: {img.size}")

# Create the glow version
glow_w, glow_h = img.size
pad = 70
glow_bg = Image.new("RGBA", (glow_w + pad * 2, glow_h + pad * 2), (0, 0, 0, 0))
offset = (pad, pad)

robot_alpha = img.split()[3]

# Layer 1: Wide soft blue glow (outer)
blue_glow = Image.new("RGBA", img.size, (96, 165, 250, 0))
blue_glow.paste((96, 165, 250, 90), mask=robot_alpha)
blue_glow = blue_glow.filter(ImageFilter.GaussianBlur(radius=55))
glow_bg.paste(blue_glow, offset, blue_glow)

# Layer 2: Medium cyan glow (middle)
cyan_glow = Image.new("RGBA", img.size, (34, 211, 238, 0))
cyan_glow.paste((34, 211, 238, 130), mask=robot_alpha)
cyan_glow = cyan_glow.filter(ImageFilter.GaussianBlur(radius=30))
glow_bg.paste(cyan_glow, offset, cyan_glow)

# Layer 3: Tight bright glow (inner)
bright_glow = Image.new("RGBA", img.size, (165, 243, 252, 0))
bright_glow.paste((165, 243, 252, 70), mask=robot_alpha)
bright_glow = bright_glow.filter(ImageFilter.GaussianBlur(radius=12))
glow_bg.paste(bright_glow, offset, bright_glow)

# Layer 4: The robot itself
glow_bg.paste(img, offset, img)

# Add floating particle dots
import random
random.seed(42)
particles = Image.new("RGBA", glow_bg.size, (0, 0, 0, 0))
px = particles.load()
for _ in range(35):
    x = random.randint(0, glow_bg.size[0] - 1)
    y = random.randint(0, glow_bg.size[1] - 1)
    dist = ((x - glow_bg.size[0]//2)**2 + (y - glow_bg.size[1]//2)**2)**0.5
    if dist > glow_w // 3 and dist < glow_w // 2 + 40:
        color = random.choice([(34, 211, 238), (96, 165, 250), (167, 139, 250)])
        alpha = random.randint(80, 180)
        size = random.choice([1, 1, 2, 2, 3])
        for dx in range(size):
            for dy in range(size):
                if 0 <= x+dx < glow_bg.size[0] and 0 <= y+dy < glow_bg.size[1]:
                    px[x+dx, y+dy] = (*color, alpha)

particles = particles.filter(ImageFilter.GaussianBlur(radius=0.5))
glow_bg = Image.alpha_composite(glow_bg, particles)

glow_bg.save(OUT_GLOW, "PNG")
print(f"Saved robot with glow to {OUT_GLOW}, size: {glow_bg.size}")

# Stats
final_arr = np.array(glow_bg)
total = final_arr.shape[0] * final_arr.shape[1]
transparent = (final_arr[:,:,3] == 0).sum()
print(f"Transparent: {transparent}/{total} ({100*transparent/total:.1f}%)")
