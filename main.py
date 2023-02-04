from flask import Flask
import os

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
def main() -> str:
	from vidget import vidget
	path = vidget()
	bucketName = getBucketName()
	finalUrl = saveToGCPBucket(path, bucketName)
	return finalUrl

if __name__ == "__main__":
    # Development only: run "python main.py" and open http://localhost:8080
    # When deploying to Cloud Run, a production-grade WSGI HTTP server,
    # such as Gunicorn, will serve the app.
    app.run(host="localhost", port=8080, debug=True)


