require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const tls = require('tls');



const url = process.env.MONGO_URI;
// const caFile = '/Users/mohammadkhizer/Desktop/nodejs/dummy/src/ssl/ca.crt';
// const certKeyFile = '/Users/mohammadkhizer/Desktop/nodejs/dummy/src/ssl/client.pem';


// const secureContext = tls.createSecureContext({
//   ca: fs.readFileSync(caFile),
//   cert: fs.readFileSync(certKeyFile),
// });

// Connection URL

const client = new MongoClient(url, {
  tls:true,
  tlsCAFile: './ssl/ca.crt',
  tlsCertificateKeyFile: './ssl/client.pem',
  // tlsAllowInvalidHostnames: true,
  // tlsAllowInvalidCertificates:true
});

// Database Name
const dbName = 'myDb';

async function main() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('documents');
    const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    console.log('Inserted documents =>', insertResult);
    return 'done.';
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);