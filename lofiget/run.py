from datetime import datetime
from firestoreDataAccess import saveToFirestore, checkForSkyChange, FirestoreCollections, FirestoreCollectionNames
from skyCheck import getSkyData
from vidget import vidget
import logging
import os
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO)


def saveToGCPBucket(path, bucketName) -> str:
    from google.cloud import storage
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucketName)
    blob = bucket.blob(os.path.basename(path))
    blob.upload_from_filename(path)
    return blob.public_url


currentDateTime = datetime.now()
path, frame = vidget()
finalUrl = saveToGCPBucket(path, os.environ.get('lofigirlframesbucket', 'lofigirlframes'))
skyData = getSkyData(frame)
FirestoreCollections.setInstance(FirestoreCollectionNames(
    os.environ['framesCollection'], os.environ['currentSkyCollection'], os.environ['skyDurationsCollection']))
currentSkyData = {'datetime': currentDateTime, 'url': finalUrl,
                  'sky': skyData.sky, 'brightnessDelta': skyData.brightnessDelta}

logging.info(currentSkyData)
logging.info(" to " + os.environ['framesCollection'])
saveToFirestore(currentSkyData)
checkForSkyChange(currentSkyData)
