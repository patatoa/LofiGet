import { Storage, Bucket, File } from '@google-cloud/storage';

const storage = new Storage();

async function getLatestFile(bucketName: string): Promise<File> {
  const [bucket] = await storage.bucket(bucketName).get();
  const [files] = await bucket.getFiles();

  // Sort the files by creation time, so the latest file is first
  files.sort((a:any, b:any) => b.metadata.timeCreated - a.metadata.timeCreated);

  return files[0];
}

export { getLatestFile };