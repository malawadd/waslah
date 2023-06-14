import { MongoClient } from 'mongodb'
import { ACTIVITY_TYPES } from '../../../utils/activities-util'
import { randomUUID } from 'crypto'
import { SpheronClient, ProtocolEnum } from "@spheron/storage";
const fs = require('fs');

const BULK_SIZE = 1000
export default function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return migrate(req, res)
  }
}
//
async function migrate(req, res) {
  const { mongoConfig, spheronStoreConfig } = req.body

  const mongoClient = new MongoClient(mongoConfig.host, {})

  const migrationId = randomUUID()
  try {
  

    await mongoClient.connect()

    const collection = mongoClient.db(`${(mongoConfig.dbName)}`).collection(`${(mongoConfig.selectedCollections)}`);
    const data = await collection.find({}).toArray();
    const token = spheronStoreConfig.dbUser
    const spheron1 = new SpheronClient({token});
    const filename = `${(mongoConfig.dbName)}_${(mongoConfig.selectedCollections)}`
    const downloaded = await downloadJSON(filename, data)
    const jsonString = filename;
    
    const { uploadId, bucketId, protocolLink, dynamicLinks } = await spheron1.upload(
      jsonString,
    {
      protocol: ProtocolEnum.FILECOIN,
      name : "waslah.xyz",
      
    }
  );
    const message = `Successfully migrated database ${mongoConfig.dbName} to ${spheronStoreConfig.dbName}`
   
    res.json({
      message,
      protocolLink,
      success: true,
    })
  } catch (err) {
    const message = `Error while migrating collections in migration ${migrationId}`
  
    console.error(message, err)
    res.json({
      message,
      error: err,
      success: true,
    })
  } finally {
    await mongoClient.close()
  }
}


async function downloadJSON(filename, jsonData) {

  fs.writeFileSync(filename, JSON.stringify(jsonData));
}
