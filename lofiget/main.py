from datetime import datetime
from firestoreDataAccess import saveToFirestore, checkForSkyChange, FirestoreCollections, FirestoreCollectionNames
from flask import Flask
import os
import logging, sys
from skyCheck import getSkyData
import google.cloud.logging

# Instantiates a client
client = google.cloud.logging.Client()

# Retrieves a Cloud Logging handler based on the environment
# you're running in and integrates the handler with the
# Python logging module. By default this captures all logs
# at INFO level and higher
client.setup_logging()

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
app = Flask(__name__)


def saveToGCPBucket(path, bucketName) -> str:
    from google.cloud import storage
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucketName)
    blob = bucket.blob(os.path.basename(path))
    blob.upload_from_filename(path)
    return blob.public_url


def getBucketName() -> str:
    return os.environ.get('lofigirlframesbucket', 'lofigirlframes')


@app.get("/")
def main() -> None:
	from vidget import vidget
	currentDateTime = datetime.now()
	path = vidget()
	bucketName = getBucketName()
	finalUrl = saveToGCPBucket(path, bucketName)
	skyData = getSkyData(path)
	FirestoreCollections.setInstance(FirestoreCollectionNames(
		os.environ['framesCollection'], os.environ['currentSkyCollection'], os.environ['skyDurationsCollection']))
	currentSkyData = {'datetime': currentDateTime, 'url': finalUrl,
						'sky': skyData.sky, 'brightnessDelta': skyData.brightnessDelta}
	
	logging.info(currentSkyData)
	print(currentSkyData)
	logging.info(" to " + os.environ['framesCollection'])
	print(" to " + os.environ['framesCollection'])
	saveToFirestore(currentSkyData)
	checkForSkyChange(currentSkyData)
	return currentSkyData


if __name__ == "__main__":
    # Development only: run "python main.py" and open http://localhost:8080
    # When deploying to Cloud Run, a production-grade WSGI HTTP server,
    # such as Gunicorn, will serve the app.
    app.run(host="localhost", port=8080, debug=True)
