require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');

// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url, {
  tls: true,
  tlsCAFile: '/etc/ssl/ca.crt',
  tlsCertificateKeyFile: '/etc/ssl/client.pem',
//   tlsAllowInvalidHostnames: false,
//   tlsAllowInvalidCertificates: false
});

// Database Name
const dbName = 'myProject';

async function main() {
  try {
    // Use connect method to connect to the server
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