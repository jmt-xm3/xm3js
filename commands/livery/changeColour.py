from PIL import Image


def change_colour(image_path, target_color, replacement_color, tolerance=0):
    """
    Change a specific color in an image to another color.

    Parameters:
        image_path (str): Path to the input image.
        target_color (tuple): RGB tuple representing the color to be replaced (e.g., (R, G, B)).
        replacement_color (tuple): RGB tuple representing the color to replace with (e.g., (R, G, B)).
        tolerance (int, optional): Color tolerance to match the target color (default is 0).

    Returns:
        Image object: The modified image.
    """
    img = Image.open(image_path)
    # Convert the image to RGBA mode to handle transparency
    img = img.convert("RGBA")

    data = img.getdata()
    new_data = []

    for item in data:
        # Check if the pixel color is similar to the target color within the tolerance
        if (
            abs(item[0] - target_color[0]) <= tolerance
            and abs(item[1] - target_color[1]) <= tolerance
            and abs(item[2] - target_color[2]) <= tolerance
        ):
            # Preserve the original alpha value
            new_data.append(replacement_color + (item[3],))
        else:
            new_data.append(item)

    img.putdata(new_data)
    return img


if __name__ == "__main__":
    input_image_path = "/home/jonan0/Documents/GitHub/xm3Bot/EVO2DAZZLE.png"
    target_color_rgb = (0, 0, 0)  # Target color (e.g., red)
    replacement_color_rgb = (0, 255, 0)  # Replacement color (e.g., green)

    # You can also provide a tolerance value (e.g., 20) to adjust how closely the colors should match.
    # For example, a larger tolerance will match a broader range of similar colors.

    output_image = change_colour(
        input_image_path, target_color_rgb, replacement_color_rgb)
    output_image.save("/home/jonan0/Documents/GitHub/xm3Bot/NEWEVO2DAZZLE.png")
