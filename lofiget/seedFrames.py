import cv2
from google.cloud import storage
from datetime import datetime
import numpy as np

import urllib.request
from firestoreDataAccess import FirestoreCollectionNames, FirestoreCollections, saveToFirestore
from skyCheck import getSkyData

def get_latest_file(bucket_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blobs = list(bucket.list_blobs())

    # Sort the blobs by creation time, so the latest file is first
    blobs.sort(key=lambda x: x.time_created)

    return blobs

def get_datetime_from_url(url) -> datetime:
	import urllib.parse
	decoded_url = urllib.parse.unquote(url)
	date_string, time_string = decoded_url.split("frames/frame")[1].split(" ")[0], decoded_url.split("(")[1].split(".")[0]
	date_time = datetime.strptime(f"{date_string} {time_string}", "%d-%b-%Y %H:%M:%S")
	return date_time

def download_image(url):
	response = urllib.request.urlopen(url)
	img_array = np.asarray(bytearray(response.read()), dtype=np.uint8)
	return cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)

def main():
	FirestoreCollections.setInstance(FirestoreCollectionNames(
		'frames-staging', 'currentSky-staging', 'skyDurations-staging'))

	frames = get_latest_file('lofigirlframes')
	for frame in frames:
		frameDate = get_datetime_from_url(frame.public_url)
		skyData = getSkyData(download_image(frame.public_url))
		currentSkyData = {'datetime': frameDate, 'url': frame.public_url,
						'sky': skyData.sky, 'brightnessDelta': skyData.brightnessDelta}
		saveToFirestore(currentSkyData)
		print(currentSkyData)

if __name__ == "__main__":
    main()