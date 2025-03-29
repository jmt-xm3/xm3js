from liveryClasses import iRacingLivery
import sys

car = iRacingLivery()
car.set_car(sys.argv[1])
car.set_base_colour(sys.argv[2])
car.set_dazzle1(sys.argv[3])
car.set_dazzle2(sys.argv[4])
car.create_livery()
print(car.get_name())
