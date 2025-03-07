from liveryClasses import ACCLivery
import sys

car = ACCLivery()
car.setCar(sys.argv[1])
car.setBaseMaterialId(int(sys.argv[2]))
car.setDazzleMaterial(int(sys.argv[3]))
car.setSponsorMaterial(int(sys.argv[4]))
car.setBaseColour(int(sys.argv[5]))
car.setDazzleBottomColour(sys.argv[6])
car.setDazzleTopColour(sys.argv[7])
car.setInGameName(sys.argv[8])
car.setFolderName(sys.argv[8])
car.createLivery()
print(car.zipPath)

