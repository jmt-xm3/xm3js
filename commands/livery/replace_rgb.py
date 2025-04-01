from PIL import Image


def replace_color_channels(input_path, output_path, red_replacement, green_replacement, blue_replacement):
    img = Image.open(input_path).convert('RGB')
    pixels = img.load()
    width, height = img.size
    new_img = Image.new('RGB', (width, height))
    new_pixels = new_img.load()    
    for x in range(width):
        for y in range(height):
            r, g, b = pixels[x, y]
            new_r = (r * red_replacement[0] // 255) + (g * green_replacement[0] // 255) + (b * blue_replacement[0] // 255)
            new_g = (r * red_replacement[1] // 255) + (g * green_replacement[1] // 255) + (b * blue_replacement[1] // 255)
            new_b = (r * red_replacement[2] // 255) + (g * green_replacement[2] // 255) + (b * blue_replacement[2] // 255)
            new_r = min(max(new_r, 0), 255)
            new_g = min(max(new_g, 0), 255)
            new_b = min(max(new_b, 0), 255)
            new_pixels[x, y] = (new_r, new_g, new_b)
    new_img.save(output_path)

