import datetime
from firestoreDataAccess import FirestoreCollectionNames, FirestoreCollections, checkForSkyChange, saveToFirestore, aggregateSkyDurations


def main():
    FirestoreCollections.setInstance(FirestoreCollectionNames(
        'frames-staging', 'currentSky-staging', 'skyDurations-staging'))
    currentSkyData = {'datetime': datetime.datetime.now(), 'url': "https://www.google.com",
                      'sky': 'night', 'brightnessDelta': 50}
    list = aggregateSkyDurations()
    print(list)

if __name__ == "__main__":
    main()