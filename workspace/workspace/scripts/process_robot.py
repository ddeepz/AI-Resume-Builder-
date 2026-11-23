"""
Process the robot image:
1. Remove the light grid background (make it transparent)
2. Remove the dark info bar at the bottom (iconscout watermark)
3. Remove the ICONSCOUT watermark text at top
4. Add a soft cyan/blue glow
5. Save as transparent PNG
"""
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

SRC = "/home/z/my-project/upload/images.jpg"
OUT = "/home/z/my-project/public/ai-robot.png"

img = Image.open(SRC).convert("RGBA")
arr = np.array(img)
h, w = arr.shape[:2]

info_bar_height = 55
arr[:h, :, 3] = 255

# Remove bottom info bar
bottom_band = arr[h - info_bar_height:h, :, :]
brightness_bottom = bottom_band[:, :, :3].mean(axis=2)
dark_mask_bottom = brightness_bottom < 100
bottom_band[dark_mask_bottom] = [0, 0, 0, 0]
bottom_band[~dark_mask_bottom] = [0, 0, 0, 0]

# Remove ICONSCOUT watermark at top
top_region = arr[10:70, :, :]
brightness_top = top_region[:, :, :3].mean(axis=2)
watermark_mask = (brightness_top > 130) & (brightness_top < 230) & (
    np.abs(top_region[:, :, 0].astype(int) - top_region[:, :, 1].astype(int)) < 15
) & (np.abs(top_region[:, :, 1].astype(int) - top_region[:, :, 2].astype(int)) < 15)
center_x_start = w // 4
center_x_end = 3 * w // 4
watermark_mask[:, :center_x_start] = False
watermark_mask[:, center_x_end:] = False
top_region[watermark_mask] = [0, 0, 0, 0]

# Remove faint robot shadow
shadow_region = arr[h - 120:h - info_bar_height, :, :]
brightness_shadow = shadow_region[:, :, :3].mean(axis=2)
shadow_mask = (brightness_shadow > 215) & (brightness_shadow < 252) & (
    np.abs(shadow_region[:, :, 0].astype(int) - shadow_region[:, :, 1].astype(int)) < 10
) & (np.abs(shadow_region[:, :, 1].astype(int) - shadow_region[:, :, 2].astype(int)) < 10)
shadow_region[shadow_mask] = [0, 0, 0, 0]

# Remove main light grid background
mid_region = arr[60:h - 120, :, :]
r, g, b = mid_region[:, :, 0].astype(int), mid_region[:, :, 1].astype(int), mid_region[:, :, 2].astype(int)
brightness = (r + g + b) / 3

max_channel = np.maximum(np.maximum(r, g), b)
min_channel = np.minimum(np.minimum(r, g), b)
saturation = max_channel - min_channel

bg_mask = (brightness > 225) & (saturation < 25)
grid_mask = (brightness > 200) & (brightness <= 225) & (saturation < 20)
bg_mask = bg_mask | grid_mask

robot_body_mask = (brightness > 225) & (b > r + 5) & (saturation > 15)
bg_mask = bg_mask & ~robot_body_mask

mid_region[bg_mask] = [0, 0, 0, 0]

remaining_light = (brightness > 240) & (saturation < 10)
mid_region[remaining_light] = [0, 0, 0, 0]

img = Image.fromarray(arr)
r_ch, g_ch, b_ch, a_ch = img.split()
a_ch = a_ch.filter(ImageFilter.GaussianBlur(radius=0.8))
img = Image.merge("RGBA", (r_ch, g_ch, b_ch, a_ch))

bbox = img.getbbox()
if bbox:
    pad = 10
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(w, bbox[2] + pad)
    bottom = min(h, bbox[3] + pad)
    img = img.crop((left, top, right, bottom))

enhancer = ImageEnhance.Color(img)
img = enhancer.enhance(1.15)
enhancer = ImageEnhance.Contrast(img)
img = enhancer.enhance(1.08)

img.save(OUT, "PNG")
print(f"Saved transparent robot to {OUT}, size: {img.size}")

# Create version with glow
glow_img = img.copy()
glow_w, glow_h = img.size
glow_bg = Image.new("RGBA", (glow_w + 120, glow_h + 120), (0, 0, 0, 0))
offset = ((glow_bg.size[0] - glow_w) // 2, (glow_bg.size[1] - glow_h) // 2)

robot_alpha = img.split()[3]

cyan_glow = Image.new("RGBA", img.size, (34, 211, 238, 0))
cyan_glow.paste((34, 211, 238, 180), mask=robot_alpha)
cyan_glow = cyan_glow.filter(ImageFilter.GaussianBlur(radius=30))

blue_glow = Image.new("RGBA", img.size, (96, 165, 250, 0))
blue_glow.paste((96, 165, 250, 140), mask=robot_alpha)
blue_glow = blue_glow.filter(ImageFilter.GaussianBlur(radius=45))

glow_bg.paste(blue_glow, offset, blue_glow)
glow_bg.paste(cyan_glow, offset, cyan_glow)
glow_bg.paste(img, offset, img)

OUT_GLOW = "/home/z/my-project/public/ai-robot-glow.png"
glow_bg.save(OUT_GLOW, "PNG")
print(f"Saved robot with glow to {OUT_GLOW}, size: {glow_bg.size}")
