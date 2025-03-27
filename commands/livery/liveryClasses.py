from changeColour import change_colour as changeColoursOfImage
from overlay import overlay_images
import os
import shutil
import json
import random
import time


def hexToTuple(hexStr):
    if hexStr[0] == "#":
        hexStr = string[1:]
    return tuple(int(hexStr[i:i + 2], 16) for i in (0, 2, 4))


def random_rgb():
    return random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)


materials = [{'key': 'Glossy', 'value': 0}, {'key': 'Matte', 'value': 1}, {'key': 'Satin', 'value': 2}, {
    'key': 'Satin Metallic', 'value': 3}, {'key': 'Metallic', 'value': 4}, {'key': 'Chrome', 'value': 5},
             {'key': 'Clear Chrome', 'value': 6}]

currentDirectory = os.getcwd() + '\commands\livery'
car_models = [
    {"id": 13, "name": "Reiter Engineering R-EX GT3"},
    {"id": 34, "name": "Porsche 992 GT3 R"},
    {"id": 28, "name": "Porsche 992 GT3 Cup"},
    {"id": 23, "name": "Porsche 991 II GT3 R"},
    {"id": 9, "name": "Porsche 991 II GT3 Cup"},
    {"id": 0, "name": "Porsche 991 GT3 R"},
    {"id": 86, "name": "Porsche 935"},
    {"id": 85, "name": "Porsche 911 GT2 RS CS Evo"},
    {"id": 61, "name": "Porsche 718 Cayman GT4 Clubsport"},
    {"id": 10, "name": "Nissan GT-R Nismo GT3"},
    {"id": 6, "name": "Nissan GT-R Nismo GT3"},
    {"id": 25, "name": "Mercedes-AMG GT3"},
    {"id": 1, "name": "Mercedes-AMG GT3"},
    {"id": 60, "name": "Mercedes AMG GT4"},
    {"id": 84, "name": "Mercedes AMG GT2"},
    {"id": 35, "name": "McLaren 720S GT3 Evo"},
    {"id": 22, "name": "McLaren 720S GT3"},
    {"id": 5, "name": "McLaren 650S GT3"},
    {"id": 59, "name": "McLaren 570S GT4"},
    {"id": 83, "name": "Maserati MC20 GT2"},
    {"id": 58, "name": "Maserati MC GT4"},
    {"id": 15, "name": "Lexus RC F GT3"},
    {"id": 29, "name": "Lamborghini Huracan SuperTrofeo EVO2"},
    {"id": 18, "name": "Lamborghini Huracan SuperTrofeo"},
    {"id": 33, "name": "Lamborghini Huracan GT3 Evo 2"},
    {"id": 16, "name": "Lamborghini Huracan GT3 Evo"},
    {"id": 4, "name": "Lamborghini Huracan GT3"},
    {"id": 82, "name": "KTM XBOW GT2"},
    {"id": 57, "name": "KTM X-Bow GT4"},
    {"id": 21, "name": "Honda NSX GT3 Evo"},
    {"id": 17, "name": "Honda NSX GT3"},
    {"id": 56, "name": "Ginetta G55 GT4"},
    {"id": 36, "name": "Ford Mustang GT3"},
    {"id": 24, "name": "Ferrari 488 GT3 Evo"},
    {"id": 2, "name": "Ferrari 488 GT3"},
    {"id": 26, "name": "Ferrari 488 Challenge Evo"},
    {"id": 32, "name": "Ferrari 296 GT3"},
    {"id": 14, "name": "Emil Frey Jaguar G3"},
    {"id": 55, "name": "Chevrolet Camaro GT4"},
    {"id": 7, "name": "BMW M6 GT3"},
    {"id": 53, "name": "BMW M4 GT4"},
    {"id": 30, "name": "BMW M4 GT3"},
    {"id": 27, "name": "BMW M2 Club Sport Racing"},
    {"id": 11, "name": "Bentley Continental GT3"},
    {"id": 8, "name": "Bentley Continental GT3"},
    {"id": 52, "name": "Audi R8 LMS GT4"},
    {"id": 31, "name": "Audi R8 LMS GT3 Evo 2"},
    {"id": 80, "name": "Audi R8 LMS GT2"},
    {"id": 19, "name": "Audi R8 LMS Evo"},
    {"id": 3, "name": "Audi R8 LMS"},
    {"id": 51, "name": "Aston Martin Vantage GT4"},
    {"id": 12, "name": "AMR V12 Vantage GT3"},
    {"id": 20, "name": "AMR V8 Vantage"},
    {"id": 50, "name": "Alpine A110 GT4"}
]


class ACCLivery:
    def __init__(self):
        self.liveryID = str(random.randint(1, 100000))
        self.car = "AMR V8 Vantage"
        self.folderName = "DEFAULT"
        self.inGameName = "DEFAULT"
        self.carModelType = 12  # AMR V8 Vantage
        self.baseColour = 341  # Black
        self.baseMaterialId = 0  # Glossy
        self.rimColour = 1
        self.rimMaterialId = 0
        self.rimTapeColour = 1
        self.rimTapeMaterialId = 0
        self.raceNumber = 000
        self.DazzleTopColour = (255, 255, 255)
        self.DazzleBottomColour = (255, 255, 255)
        self.DazzleMaterial = 0
        self.SponsorMaterial = 0
        self.zipPath = ''

    # Getter methods

    def setFolderName(self, folderName):
        self.folderName = folderName

    def setInGameName(self, inGameName):
        self.inGameName = inGameName

    def setCarModelType(self, carModelType):
        self.carModelType = carModelType

    def setBaseColour(self, baseColour):
        self.baseColour = baseColour

    def setBaseMaterialId(self, baseMaterialId):
        self.baseMaterialId = baseMaterialId

    def setRimColour(self, rimColour):
        self.rimColour = rimColour

    def setRimMaterialId(self, rimMaterialId):
        self.rimMaterialId = rimMaterialId

    def setRimTapeColour(self, rimTapeColour):
        self.rimTapeColour = rimTapeColour

    def setRimTapeMaterialId(self, rimTapeMaterialId):
        self.rimTapeMaterialId = rimTapeMaterialId

    def setRaceNumber(self, raceNumber):
        self.raceNumber = raceNumber

    def setDazzleTopColour(self, DazzleTopColour):
        self.DazzleTopColour = hexToTuple(DazzleTopColour)

    def setDazzleBottomColour(self, DazzleBottomColour):
        self.DazzleBottomColour = hexToTuple(DazzleBottomColour)

    # Setter methods
    def setFolderName(self, folderName):
        self.folderName = folderName

    def setInGameName(self, inGameName):
        self.inGameName = inGameName

    def setCarModelType(self, carModelType):
        self.carModelType = carModelType

    def setCar(self, car):
        for cars in car_models:
            if cars['name'] == car:
                self.car = car
                self.carModelType = cars['id']
                return

    def setBaseColour(self, baseColour):
        self.baseColour = baseColour

    def setBaseMaterialId(self, baseMaterialId):
        self.baseMaterialId = baseMaterialId

    def setRimColour(self, rimColour):
        self.rimColour = rimColour

    def setRimMaterialId(self, rimMaterialId):
        self.rimMaterialId = rimMaterialId

    def setRimTapeColour(self, rimTapeColour):
        self.rimTapeColour = rimTapeColour

    def setRimTapeMaterialId(self, rimTapeMaterialId):
        self.rimTapeMaterialId = rimTapeMaterialId

    def setRaceNumber(self, raceNumber):
        self.raceNumber = raceNumber

    def setDazzleMaterial(self, DazzleMaterial):
        self.DazzleMaterial = DazzleMaterial

    def setSponsorMaterial(self, SponsorMaterial):
        self.SponsorMaterial = SponsorMaterial

    def setZipPath(self, zipPath):
        self.zipPath = zipPath

    # Getter methods
    def getFolderName(self):
        return self.folderName

    def getInGameName(self):
        return self.inGameName

    def getCarModelType(self):
        return self.carModelType

    def getBaseColour(self):
        return self.baseColour

    def getBaseMaterialId(self):
        return self.baseMaterialId

    def getRimColour(self):
        return self.rimColour

    def getRimMaterialId(self):
        return self.rimMaterialId

    def getRimTapeColour(self):
        return self.rimTapeColour

    def getRimTapeMaterialId(self):
        return self.rimTapeMaterialId

    def getRaceNumber(self):
        return self.raceNumber

    def getDazzleTopColour(self):
        return self.DazzleTopColour

    def getDazzleBottomColour(self):
        return self.DazzleBottomColour

    def getZipPath(self):
        return self.zipPath

    def getSponsorMaterial(self):
        return self.sponsorMaterial

    def getDazzleMaterial(self):
        return self.DazzleMaterial

    # Other methods
    def createDazzle(self):
        dazzlePath = os.path.join(currentDirectory, 'acc', self.car, 'decals.png')
        sponsorPath = os.path.join(currentDirectory, 'acc', self.car, 'sponsors.png')
        try:
            os.chdir(os.path.join(currentDirectory, "temp"))
            os.mkdir(self.liveryID)
            os.chdir(os.path.join(os.getcwd(), self.liveryID))
            os.mkdir('Liveries')
            os.chdir(os.path.join(os.getcwd(), 'Liveries'))
            os.mkdir(self.folderName)
        except FileExistsError:
            pass
        carPath = os.path.join(currentDirectory, 'temp',
                               self.liveryID, 'Liveries', self.folderName)
        os.chdir(currentDirectory)
        randomHex = ''.join(random.choice('0123456789ABCDEF') for _ in range(6))
        placeholderColour = hexToTuple(randomHex)
        while placeholderColour == self.DazzleTopColour or placeholderColour == self.DazzleBottomColour:
            randomHex = ''.join(random.choice('0123456789ABCDEF') for _ in range(6))
            placeholderColour = hexToTuple(randomHex)
        placeholderColour = placeholderColour
        tempChange = changeColoursOfImage(dazzlePath, (0, 0, 0), placeholderColour)
        tempChange.save(carPath + "/decals.png")
        first = changeColoursOfImage(carPath + "/decals.png", (255, 255, 255), self.DazzleBottomColour)
        first.save(carPath + "/decals.png")
        final = changeColoursOfImage(carPath + "/decals.png", placeholderColour, self.DazzleTopColour)
        final.save(carPath + "/decals.png")
        shutil.copy(sponsorPath, os.path.join(carPath, 'sponsors.png'))
        for mat in materials:
            if self.DazzleMaterial == mat['value']:
                shutil.copy(os.path.join(currentDirectory, 'acc', mat['key'] + '.json'),
                            os.path.join(carPath, 'dazzle.json'))
                break
        for mat in materials:
            if self.SponsorMaterial == mat['value']:
                shutil.copy(os.path.join(currentDirectory, 'acc', mat['key'] + '.json'),
                            os.path.join(carPath, 'sponsors.json'))
                break  # DDS works but acc is a shit game and won't recognize them unless you turn off texDDS in menuSettings.json
        '''toDDS(os.path.join(carPath,'decals'),os.path.join(carPath,'decals_0')
        shutil.copy(os.path.join(carPath,'decals_0.dds'),os.path.join(carPath,'decals_1.dds'))
        toDDS(os.path.join(carPath,'sponsors'),os.path.join(carPath,'sponsors_0'))
        shutil.copy(os.path.join(carPath,'sponsors_0.dds'),os.path.join(carPath,'sponsors_1.dds'))'''

    def createJsonFile(self):
        examplePath = os.path.join(currentDirectory, "acc", "example.json")
        jsonDirectory = os.path.join(currentDirectory, "temp", self.liveryID)
        os.chdir(jsonDirectory)
        try:
            os.mkdir('Cars')
        except:
            pass
        jsonDirectory = os.path.join(
            jsonDirectory, 'Cars', self.liveryID + '.json')
        os.chdir(currentDirectory)
        shutil.copy(examplePath, jsonDirectory)
        with open(jsonDirectory, 'rb') as f:
            data = json.load(f)
        if self.carModelType == 20:
            data['skinTemplateKey'] = 103
        if self.carModelType == 8:
            data['skinTemplateKey'] = 103  # fuck kunos for making me do this
        data['carModelType'] = self.carModelType
        data['raceNumber'] = self.raceNumber
        data['skinColor1Id'] = self.baseColour
        data['skinColor2Id'] = self.baseColour
        data['skinColor3Id'] = self.baseColour
        data['skinMaterialType1'] = self.baseMaterialId
        data['skinMaterialType2'] = self.baseMaterialId
        data['skinMaterialType3'] = self.baseMaterialId
        data['rimColor1Id'] = self.rimColour
        data['rimColor2Id'] = self.rimTapeColour
        data['rimMaterialType1'] = self.rimMaterialId
        data['rimMaterialType2'] = self.rimTapeMaterialId
        data['teamName'] = self.inGameName
        data['customSkinName'] = self.folderName
        with open(jsonDirectory, 'w') as out:
            json.dump(data, out)
        out.close()
        f.close()

    def zipCar(self):
        self.setZipPath(os.path.join(currentDirectory, 'temp', self.liveryID))
        tempDirectory = os.path.join(currentDirectory, 'temp')
        os.chdir(tempDirectory)
        shutil.make_archive(str(self.liveryID), 'zip', self.zipPath)
        self.setZipPath(os.path.join(currentDirectory,
                                     'temp', self.liveryID) + '.zip')
        os.chdir(currentDirectory)

    def createLivery(self):
        self.createDazzle()
        self.createJsonFile()
        self.zipCar()
        return self.zipPath


class iRacingLivery:
    def __init__(self):
        self.name = str(random.randint(1, 10000000)) + '.png'
        self.path = os.path.join(currentDirectory, "temp", self.name)
        self.base = os.path.join(currentDirectory, "temp", 'base' + self.name)
        self.base_colour = (255, 0, 0)
        self.dazzle1 = (0, 255, 0)
        self.dazzle2 = (0, 0, 255)
        self.car = "lmp2"

    def set_name(self, name):
        self.name = name

    def set_path(self, path):
        self.path = path

    def set_base_colour(self, base_colour):
        self.base_colour = hexToTuple(base_colour)

    def set_dazzle1(self, dazzle1):
        self.dazzle1 = hexToTuple(dazzle1)

    def set_dazzle2(self, dazzle2):
        self.dazzle2 = hexToTuple(dazzle2)

    def set_car(self, car):
        self.car = car

    def get_name(self):
        return self.name

    def get_path(self):
        return self.path

    def get_base_colour(self):
        return self.base_colour

    def get_dazzle1(self):
        return self.dazzle1

    def get_dazzle2(self):
        return self.dazzle2

    def get_car(self):
        return self.car

    def create_livery(self):
        from PIL import Image
        carDir = os.path.join(os.getcwd(), 'commands', 'livery', 'iracing', self.car)
        dazzlePath = os.path.join(carDir, 'dazzle.png')
        sponsorPath = os.path.join(carDir, 'sponsors.png')
        specMap = os.path.join(carDir, 'spec.mip')
        dazzleCopyPath = os.path.join(os.getcwd(), 'commands', 'livery', 'temp', self.name)
        base = Image.new('RGB', (2048, 2048), self.base_colour)
        base.save(self.base)
        shutil.copy(dazzlePath, dazzleCopyPath)
        if self.dazzle1 == (255, 255, 255):
            dazzle = changeColoursOfImage(dazzleCopyPath, (255, 255, 255), self.dazzle2)
            dazzle.save(dazzleCopyPath)
            dazzle = changeColoursOfImage(dazzleCopyPath, (0, 0, 0), self.dazzle1)
            dazzle.save(dazzleCopyPath)
        else:
            dazzle = changeColoursOfImage(dazzleCopyPath, (0, 0, 0), self.dazzle1)
            dazzle.save(dazzleCopyPath)
            dazzle = changeColoursOfImage(dazzleCopyPath, (255, 255, 255), self.dazzle2)
            dazzle.save(dazzleCopyPath)
        overlay_images(self.base, dazzleCopyPath, self.path)
        overlay_images(self.path, sponsorPath, self.path)
        return specMap, self.path


car = ACCLivery()
car.setDazzleTopColour('000000')
car.setDazzleBottomColour('000000')
