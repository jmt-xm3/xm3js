import sys
import os
import shutil
from overlay import overlay_images
from replace_rgb import replace_color_channels as replace_rgb
from changeColour import change_colour
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

def hexToTuple(hexStr):
    if hexStr[0] == "#":
        hexStr = hexStr[1:]
    return tuple(int(hexStr[i:i + 2], 16) for i in (0, 2, 4))


# Open the desired Image you want to add text on
from pathlib import Path


def new_name(name,colour_string, destiny):
    try:
        colour = hexToTuple(colour) 
    except:
        colour = (255, 255, 255)

    size_class = 0
    destination = Path('.') / 'commands' / 'livery' / 'suit' / (str(destiny) + ".png")
    if len(name) <= 5:
        fsize = 24
    elif len(name) <= 8:
        fsize = 20
        size_class = 1
    elif len(name) <= 12:
        fsize = 16
        size_class = 2
    elif len(name) <= 15:
        fsize = 12
        size_class = 3
    else:
        fsize = 10
        size_class = 4
    i = Image.new(mode="RGBA", size=(120, 60))
    try:
        colour = hexToTuple(colour_string)
        mf = ImageFont.truetype(font=r"commands\livery\OpenSans-Regular.ttf", size=fsize)
    except:
        print('Font failure')
        mf = ImageFont.load_default()
    Im = ImageDraw.Draw(i)
    text_width = Im.textlength(name, font=mf)
    Im.text(((120 - text_width) / 2, 20), name, colour, font=mf)
    i.save(destination)
    i7 = i.rotate(7, expand=True, resample=Image.BICUBIC, fillcolor=(0, 0, 0, 0))
    i7.save(destination)
    return size_class
    

def name_on_suit(name_path,suit_path,destination,size_class):
    img1 = Image.open(suit_path)
    img2 = Image.open(name_path)
    if size_class == 0:
        img1.paste(img2, (543,355), mask = img2)
    elif size_class == 1:
        img1.paste(img2, (543,357), mask = img2)
    elif size_class == 2:
        img1.paste(img2, (543,358), mask = img2)
    elif size_class == 3:
        img1.paste(img2, (543,362), mask = img2)
    elif size_class ==4:
        img1.paste(img2, (543,364), mask = img2)
    img1.save(destination)
    img1.show()

name_size = new_name("Smithington",'FFFFFF',"Turner")
suitpath = Path('.') / 'commands' / 'livery' / 'suit' / "sample2.png"
namepath = Path('.') / 'commands' / 'livery' / 'suit' / "turner.png"
resultpath = Path('.') / 'commands' / 'livery' / 'suit' / "test.png"
name_on_suit(namepath, suitpath,resultpath,name_size)

"""design = str(sys.argv[1])
c1 = str(sys.argv[2])
c2 = str(sys.argv[3])
c3 = str(sys.argv[4])
cv = str(sys.argv[5])
visor = str(sys.argv[6])
uid = str(sys.argv[7])
custom = str(sys.argv[8])
sponsor = str(sys.argv[9])"""

