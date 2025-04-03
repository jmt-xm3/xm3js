import sys
import os
import shutil
from overlay import overlay_images
from replace_rgb import replace_color_channels as replace_rgb
from changeColour import change_colour
from PIL import Image

def hexToTuple(hexStr):
    if hexStr[0] == "#":
        hexStr = string[1:]
    return tuple(int(hexStr[i:i + 2], 16) for i in (0, 2, 4))




design = str(sys.argv[1])
c1 = str(sys.argv[2])
c2 = str(sys.argv[3])
c3 = str(sys.argv[4])
cv = str(sys.argv[5])
visor = str(sys.argv[6])
uid = str(sys.argv[7])
custom = str(sys.argv[8])
sponsor = str(sys.argv[9])


helmet_path = os.path.join('./commands/livery/temp', (uid + '.png'))
visor_path = os.path.join('./commands/livery/temp', (uid + 'visor.png'))
if custom == '0':
    colour1 = hexToTuple(c1)
    colour2 = hexToTuple(c2)
    colour3 = hexToTuple(c3)
colour_visor = hexToTuple(cv)


if visor == "None":
    strip_path = './commands/livery/helmet/strip/darkwhitetext.png'
else:
    strip_path = os.path.join('./commands/livery/helmet/strips/',visor)

sponsors_on_helmet = True
sponsor_path = ""
if sponsor == "None":
    sponsors_on_helmet = False
else:
    sponsor_path = os.path.join('./commands/livery/helmet/sponsors/', sponsor)



if custom == '1':
    user_image = Image.open(design)
    user_image.resize((1024,1024))
    user_image.save(helmet_path)
else:
    design_path = os.path.join('./commands/livery/helmet/designs', design + '.png')
    replace_rgb(design_path, helmet_path, colour1, colour2, colour3)
overlay_images(helmet_path, './commands/livery/helmet/decals.png', helmet_path)
shutil.copyfile('./commands/livery/helmet/visor.png', visor_path)
change_colour(visor_path, (0, 0, 255), replacement_color=colour_visor)

if sponsors_on_helmet:
    overlay_images(helmet_path, sponsor_path, helmet_path)
overlay_images(helmet_path, strip_path, helmet_path)
overlay_images(helmet_path, visor_path, helmet_path)
print(helmet_path)
