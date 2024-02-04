from collections import namedtuple
from attr import dataclass
from google.cloud import firestore

FirestoreCollectionNames = namedtuple('FirestoreCollectionNames', ['frames', 'currentSky', 'skyDurations'])

class FirestoreCollections:
    __instance = None

    @staticmethod 
    def setInstance(collectionNames: FirestoreCollectionNames):
        if FirestoreCollections.__instance == None:
            FirestoreCollections(collectionNames)
        return FirestoreCollections.__instance

    @staticmethod 
    def getInstance():
        if FirestoreCollections.__instance == None:
            raise Exception("FirestoreCollectionNames has not been initialized")
        return FirestoreCollections.__instance

    def __init__(self, collectionNames: FirestoreCollectionNames):
        if FirestoreCollections.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            FirestoreCollections.__instance = self
            self.env_vars = {}
            if collectionNames == None:
                raise Exception("collectionNames cannot be None")
            else:
                self.frames = collectionNames.frames
                self.currentSky = collectionNames.currentSky
                self.skyDurations = collectionNames.skyDurations

@dataclass
class SkyDurationAggregation:
	dayTotalDuration: float
	dayTotalCount: int
	dayAverageDuration: float
	dayMaxDuration: float
	dayMinDuration: float
	nightTotalDuration: float
	nightTotalCount: int
	nightAverageDuration: float
	nightMaxDuration: float
	nightMinDuration: float

def saveToFirestore(data: dict) -> None:
	db = firestore.Client()
	db.collection(FirestoreCollections.getInstance().frames).add(data)

def checkForSkyChange(currentSnapshot: dict) -> bool:
	def getCurrentSkyQuery() -> firestore.Query:
		return db.collection(FirestoreCollections.getInstance().currentSky).limit(1).get()[0]

	def getCurrentSkyData() -> dict:
		return getCurrentSkyQuery().to_dict()

	def updateCurrentSkyData(data: dict) -> None:
		currentSky = getCurrentSkyQuery()
		currentSky.reference.update({
                      'timeStart': data['datetime'],
                      'url': data['url'],
                      'sky': data['sky'],
                      'isApproximateStart': False
		})

	def updateSkyDurations(data: dict )-> None:
		recentSkyDuration = db.collection(FirestoreCollections.getInstance().skyDurations).where('timeEnd', '==', '').get()
		print(recentSkyDuration.__len__())
		for key in recentSkyDuration:
			key.reference.update({'timeEnd': data['datetime']})
		db.collection(FirestoreCollections.getInstance().skyDurations).add({'timeStart': data['datetime'], 'sky': data['sky'], 'timeEnd': ""})

	db = firestore.Client()
	currentSkyData = getCurrentSkyData()
	print(currentSkyData['sky'])

	if currentSkyData['sky'] == currentSnapshot['sky']:
		return False
	else:
		updateCurrentSkyData(currentSnapshot)
		print("Sky changed to " + currentSnapshot['sky'])
		updateSkyDurations(currentSnapshot)
		print("Sky duration updated")
		return True

def getAllSkyDurations() -> list:
	db = firestore.Client()
	skyDurations = db.collection(FirestoreCollections.getInstance().skyDurations).get()
	return [sky.to_dict() for sky in skyDurations]
def calculateDurationData(skyDurations, skyType):
    totalDuration, totalCount, minDuration, maxDuration = 0, 0, float('inf'), 0
    for skyDuration in skyDurations:
        if skyDuration['sky'] == skyType:
            timeEnd = skyDuration['timeEnd']
            if timeEnd == "":
                timeEnd = datetime.now(timezone.utc)
            duration = (timeEnd - skyDuration['timeStart']).total_seconds()
            totalDuration += duration
            totalCount += 1
            minDuration = min(minDuration, duration)
            maxDuration = max(maxDuration, duration)
    return totalDuration, totalCount, minDuration if totalCount > 0 else 0, maxDuration

def aggregateSkyDurations() -> SkyDurationAggregation:
    skyDurations = getAllSkyDurations()
    dayTotalDuration, dayTotalCount, dayMinDuration, dayMaxDuration = calculateDurationData(skyDurations, 'day')
    nightTotalDuration, nightTotalCount, nightMinDuration, nightMaxDuration = calculateDurationData(skyDurations, 'night')
    return SkyDurationAggregation(dayTotalDuration, dayTotalCount, dayTotalDuration/dayTotalCount if dayTotalCount > 0 else 0, dayMaxDuration, dayMinDuration, nightTotalDuration, nightTotalCount, nightTotalDuration/nightTotalCount if nightTotalCount > 0 else 0, nightMaxDuration, nightMinDuration)