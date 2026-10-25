from PIL import Image, ImageDraw, ImageFont
import math

def create_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Obsidian Carbon background (#090a0e to #131620)
    for y in range(size):
        ratio = y / size
        r = int(9 + (19 - 9) * ratio)
        g = int(10 + (22 - 10) * ratio)
        b = int(14 + (32 - 14) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Subtle Volt radial glow in center
    cx, cy = size // 2, size // 2
    glow_radius = int(size * 0.42)
    for rad in range(glow_radius, 0, -2):
        alpha = int(28 * (1 - rad / glow_radius))
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=(212, 255, 0, alpha))

    # Kinetic Volt (#d4ff00) Athletic Lightning symbol
    scale = size / 512.0
    points = [
        (275 * scale, 65 * scale),
        (155 * scale, 275 * scale),
        (245 * scale, 275 * scale),
        (225 * scale, 445 * scale),
        (375 * scale, 215 * scale),
        (285 * scale, 215 * scale),
    ]

    # Shadow
    shadow_points = [(p[0] + 3 * scale, p[1] + 4 * scale) for p in points]
    draw.polygon(shadow_points, fill=(5, 6, 8, 180))

    # Main Kinetic Volt body (#d4ff00)
    draw.polygon(points, fill=(212, 255, 0, 255))

    # Sharp inner highlight
    inner_points = [
        (275 * scale, 115 * scale),
        (190 * scale, 270 * scale),
        (250 * scale, 270 * scale),
        (235 * scale, 400 * scale),
        (345 * scale, 230 * scale),
        (285 * scale, 230 * scale),
    ]
    draw.polygon(inner_points, fill=(245, 255, 200, 240))

    img.save(filename, "PNG")
    print(f"Generated {filename} ({size}x{size})")

if __name__ == "__main__":
    create_icon(192, "icon-192.png")
    create_icon(512, "icon-512.png")
    create_icon(180, "apple-touch-icon.png")
