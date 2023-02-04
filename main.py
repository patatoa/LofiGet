from flask import Flask

app = Flask(__name__)

def saveToGCPBucket(path, bucketName) -> None:
	from google.cloud import storage
	import os
	storage_client = storage.Client()
	bucket = storage_client.get_bucket(bucketName)
	blob = bucket.blob(os.path.basename(path))
	blob.upload_from_filename(path)

@app.get("/")
def main() -> None:
	import vidget
	path = vidget.vidget()
	bucketName = "lofigirlframes"
	saveToGCPBucket(path, bucketName)
	return f"Saved {path} to {bucketName}"

if __name__ == "__main__":
    # Development only: run "python main.py" and open http://localhost:8080
    # When deploying to Cloud Run, a production-grade WSGI HTTP server,
    # such as Gunicorn, will serve the app.
    app.run(host="localhost", port=8080, debug=True)


