"""
Re-process the robot image:
1. Remove background (already done, load the existing transparent PNG)
2. Apply a subtle cyan/blue holographic tint to white body parts
3. Increase the glow effect for better integration with the dark theme
4. Save as the final robot image
"""
from PIL import Image, ImageFilter, ImageEnhance, ImageChops
import numpy as np

SRC = "/home/z/my-project/public/ai-robot.png"
OUT = "/home/z/my-project/public/ai-robot-glow.png"

img = Image.open(SRC).convert("RGBA")
arr = np.array(img)
h, w = arr.shape[:2]

r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

# Identify white/light body pixels (the robot's white parts)
brightness = (r.astype(int) + g.astype(int) + b.astype(int)) / 3
white_mask = (brightness > 200) & (a > 100)

# Apply a cyan-blue tint to the white body parts
# Blend white towards a light cyan-blue (like a holographic robot)
tint_r = 220  # slightly reduced red
tint_g = 240  # keep green high
tint_b = 255  # max blue

# Create a tinted version
tinted = arr.copy()
# Where white pixels are, blend towards cyan-blue
blend_factor = 0.35  # how much to tint
tinted[:,:,0] = np.where(white_mask, (arr[:,:,0] * (1 - blend_factor) + tint_r * blend_factor).astype(np.uint8), arr[:,:,0])
tinted[:,:,1] = np.where(white_mask, (arr[:,:,1] * (1 - blend_factor) + tint_g * blend_factor).astype(np.uint8), arr[:,:,1])
tinted[:,:,2] = np.where(white_mask, (arr[:,:,2] * (1 - blend_factor) + tint_b * blend_factor).astype(np.uint8), arr[:,:,2])

img_tinted = Image.fromarray(tinted)

# Enhance the color slightly
enhancer = ImageEnhance.Color(img_tinted)
img_tinted = enhancer.enhance(1.2)

# Create a larger canvas with glow
glow_w, glow_h = img_tinted.size
pad = 80
glow_bg = Image.new("RGBA", (glow_w + pad * 2, glow_h + pad * 2), (0, 0, 0, 0))
offset = (pad, pad)

robot_alpha = img_tinted.split()[3]

# Layer 1: Wide soft blue glow (outer)
blue_glow = Image.new("RGBA", img_tinted.size, (96, 165, 250, 0))
blue_glow.paste((96, 165, 250, 100), mask=robot_alpha)
blue_glow = blue_glow.filter(ImageFilter.GaussianBlur(radius=60))
glow_bg.paste(blue_glow, offset, blue_glow)

# Layer 2: Medium cyan glow (middle)
cyan_glow = Image.new("RGBA", img_tinted.size, (34, 211, 238, 0))
cyan_glow.paste((34, 211, 238, 140), mask=robot_alpha)
cyan_glow = cyan_glow.filter(ImageFilter.GaussianBlur(radius=35))
glow_bg.paste(cyan_glow, offset, cyan_glow)

# Layer 3: Tight bright glow (inner, right around the robot)
bright_glow = Image.new("RGBA", img_tinted.size, (165, 243, 252, 0))
bright_glow.paste((165, 243, 252, 80), mask=robot_alpha)
bright_glow = bright_glow.filter(ImageFilter.GaussianBlur(radius=15))
glow_bg.paste(bright_glow, offset, bright_glow)

# Layer 4: The robot itself
glow_bg.paste(img_tinted, offset, img_tinted)

# Add some floating particle dots around the robot for extra futuristic feel
import random
random.seed(42)
particles = Image.new("RGBA", glow_bg.size, (0, 0, 0, 0))
px = particles.load()
for _ in range(40):
    x = random.randint(0, glow_bg.size[0] - 1)
    y = random.randint(0, glow_bg.size[1] - 1)
    # Don't place particles on the robot itself
    dist_from_center = ((x - glow_bg.size[0]//2)**2 + (y - glow_bg.size[1]//2)**2)**0.5
    if dist_from_center > glow_w // 3 and dist_from_center < glow_w // 2 + 30:
        color = random.choice([(34, 211, 238), (96, 165, 250), (167, 139, 250)])
        alpha = random.randint(100, 200)
        size = random.choice([1, 1, 2, 2, 3])
        for dx in range(size):
            for dy in range(size):
                if 0 <= x+dx < glow_bg.size[0] and 0 <= y+dy < glow_bg.size[1]:
                    px[x+dx, y+dy] = (*color, alpha)

particles = particles.filter(ImageFilter.GaussianBlur(radius=0.5))
glow_bg = Image.alpha_composite(glow_bg, particles)

glow_bg.save(OUT, "PNG")
print(f"Saved enhanced robot with glow to {OUT}, size: {glow_bg.size}")

# Also update the base robot image with the tint
img_tinted.save("/home/z/my-project/public/ai-robot.png", "PNG")
print(f"Updated base robot with tint, size: {img_tinted.size}")
