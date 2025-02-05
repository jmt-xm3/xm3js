from PIL import Image


def overlay_images(base_path, overlay_path, output_path):
    base_image = Image.open(base_path)
    overlay_image = Image.open(overlay_path)

    if base_image.size != overlay_image.size:
        overlay_image = overlay_image.resize(base_image.size)

    result_image = Image.new('RGBA', base_image.size)
    result_image.paste(base_image, (0, 0))
    result_image.paste(overlay_image, (0, 0), overlay_image)

    result_image.save(output_path)


if __name__ == "__main__":
    overlay_images('base_image.jpg', 'overlay_image.png', 'result_image.png')
