from PIL import Image, ImageDraw, ImageFont
import math

def create_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background rounded rect or circle with radial/linear dark gradient
    for y in range(size):
        r = int(10 + (30 - 10) * (y / size))
        g = int(18 + (70 - 18) * (y / size))
        b = int(35 + (160 - 35) * (y / size))
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Glow in center
    cx, cy = size // 2, size // 2
    glow_radius = int(size * 0.45)
    for rad in range(glow_radius, 0, -2):
        alpha = int(45 * (1 - rad / glow_radius))
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=(56, 189, 248, alpha))

    # Draw a stylized lightning bolt / energetic symbol in center
    scale = size / 512.0
    # Lightning coordinates relative to 512x512
    points = [
        (270 * scale, 70 * scale),
        (150 * scale, 280 * scale),
        (240 * scale, 280 * scale),
        (220 * scale, 440 * scale),
        (370 * scale, 220 * scale),
        (280 * scale, 220 * scale),
    ]

    # Draw shadow / outer glow
    shadow_points = [(p[0] + 4 * scale, p[1] + 4 * scale) for p in points]
    draw.polygon(shadow_points, fill=(15, 23, 42, 160))

    # Draw main lightning bolt (gradient feel or vibrant cyan-yellow)
    draw.polygon(points, fill=(56, 189, 248, 255))

    # Inner bright accent
    inner_points = [
        (270 * scale, 120 * scale),
        (185 * scale, 275 * scale),
        (245 * scale, 275 * scale),
        (230 * scale, 400 * scale),
        (340 * scale, 235 * scale),
        (280 * scale, 235 * scale),
    ]
    draw.polygon(inner_points, fill=(240, 249, 255, 220))

    img.save(filename, "PNG")
    print(f"Saved {filename} ({size}x{size})")

create_icon(192, "icon-192.png")
create_icon(512, "icon-512.png")
create_icon(180, "apple-touch-icon.png")
