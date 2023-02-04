def saveToGCPBucket(path, bucketName) -> None:
	from google.cloud import storage
	import os
	storage_client = storage.Client()
	bucket = storage_client.get_bucket(bucketName)
	blob = bucket.blob(os.path.basename(path))
	blob.upload_from_filename(path)

def main() -> None:
	import vidget
	path = vidget.vidget()
	bucketName = "lofigirlframes"
	saveToGCPBucket(path, bucketName)

if __name__ == "__main__":
	main()