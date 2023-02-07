import datetime
from firestoreDataAccess import FirestoreCollectionNames, FirestoreCollections, checkForSkyChange, saveToFirestore


def main():
    FirestoreCollections.setInstance(FirestoreCollectionNames(
        'frames-staging', 'currentSky-staging', 'skyDurations-staging'))
    currentSkyData = {'datetime': datetime.datetime.now(), 'url': "https://www.google.com",
                      'sky': 'day', 'brightnessDelta': 50}
    saveToFirestore(currentSkyData)
    checkForSkyChange(currentSkyData)

if __name__ == "__main__":
    main()