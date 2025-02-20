from liveryClasses import ACCLivery
import sys

car = ACCLivery()
car.setCar(sys.argv[1])
car.setBaseMaterialId(int(sys.argv[2]))
car.zipCar()
print(car.zipPath)