import { Storage, File } from '@google-cloud/storage';
import { Firestore } from '@google-cloud/firestore';

const storage = new Storage();

async function getLatestFile(bucketName: string): Promise<File> {
  const [bucket] = await storage.bucket(bucketName).get();
  const [files] = await bucket.getFiles();

  // Sort the files by creation time, so the latest file is first
  files.sort((a:File, b:File) => 
    a.metadata.timeCreated < b.metadata.timeCreated ? 1 : -1);
 

  return files[0];
}


const getLatestDocument = async (collectionName: string, orderByField: string): Promise<FirebaseFirestore.DocumentData> => {

const firestore = new Firestore();

const collectionRef = firestore.collection(collectionName);

const latestDocumentQuery = await collectionRef
  .orderBy(orderByField, 'desc')
  .limit(1)
  .get();

  const latestDocument = latestDocumentQuery.docs[0].data();
  return latestDocument;
}

const getLatestSnapshot = async (collectionName: string): Promise<FirebaseFirestore.DocumentData> => getLatestDocument(collectionName, 'datetime');
const getLatestDuration = async (collectionName: string): Promise<FirebaseFirestore.DocumentData> => getLatestDocument(collectionName, 'timeStart');
export { getLatestFile, getLatestSnapshot, getLatestDuration };