const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function getClient() {
    if (client === null) {
        client = await MongoClient.connect(`${process.env.MONGO_URL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    return client;
}

async function cleanup() {
    if (client !== null) {
        return await client.close();
    }
}

async function getDb() {
    if (db === null) {
        const client = await getClient();
        db = await client.db('hitachdut');
    }

    return db;
}

module.exports = {
    cleanup,
    getClient,
    getDb,
};
