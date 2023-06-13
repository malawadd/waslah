import { MongoClient } from 'mongodb'
import { randomUUID } from 'crypto'
import axios from 'axios'



const BULK_SIZE = 1000
export default function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return migrateto(req, res)
  }
}
//
async function migrateto(req, res) {
  const { mongoConfig, cid } = req.body
  const ipfsLink = cid.dbUser


  const gatewayURL = `https://cloudflare-ipfs.com/ipfs/${ipfsLink}`;
  console.log(ipfsLink)
  console.log(gatewayURL)

  const migrationId = randomUUID()
  try {
    const response = await axios.get(gatewayURL);
    const fileLinks = response.data.match(/href="([^"]+\.\w+|[^"]+_[^"]+)"/g);

    if (!fileLinks) {
      console.log('No file links found in the HTML.');
      return;
    }

    const filteredFileLinks = fileLinks.filter(link => !link.includes('?filename='));

    for (const fileLink of filteredFileLinks) {
      const fileURL = fileLink.match(/href="([^"]+\.\w+|[^"]+_[^"]+)"/)[1];
      const fileFullUrl = `https://cloudflare-ipfs.com/${fileURL}`;

      // Check if the file is a JSON file
      if (fileURL.length >= 59) {
        const jsonResponse = await axios.get(fileFullUrl);
        const collectionName = fileLink.match(/href="\/ipfs\/[^"]+\/([^/"]+)"/)[1]
        console.log('collecton name', collectionName)
        const jsonData = jsonResponse.data;
        await insertDataIntoMongoDB(mongoConfig.host, mongoConfig.dbName, collectionName, jsonData);
      } 
    }
    console.log('All JSON files inserted into MongoDB successfully.');

    const message = `All JSON files inserted into MongoDB successfully`
    res.json({
      message,
      ipfsLink,
      success: true,
    })
  } catch (err) {
    const message = `Error while migrating collections in migration ${migrationId}`
  
    console.error(message, err)
    res.json({
      message,
      error: err,
      success: false,
    })
  } finally {
   
  }
}


async function insertDataIntoMongoDB(uri, dbname, collectionName, data) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbname);
    const collection = db.collection(collectionName);
    // Ensure jsonData is an object
    const jsonData = typeof data === 'object' ? data : JSON.parse(data);
    console.log('database', db)
   

    if (Array.isArray(jsonData)) {
        await collection.insertMany(jsonData);
      } else {
        await collection.insertOne(jsonData);
      }

    console.log(`Data inserted into MongoDB collection '${collectionName}' successfully.`);
  } catch (error) {
    console.error('Error inserting data into MongoDB:', 'error');
  } finally {
    await client.close();
  }
}
