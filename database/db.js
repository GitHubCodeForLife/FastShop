const { MongoClient } = require("mongodb");

const uri = process.env.URI;

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function connectDb(){
    try {
        console.log('Start connect');
        await client.connect();
        database = await client.db("test");
        console.log('Db connected!');
    } catch (e) {
        console.error(e);
    }

}

console.log('RUNNING DB...');

connectDb();

const db = () => database;

module.exports.db = db;