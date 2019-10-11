const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function getClient() {
    if (client === null) {
        client = await MongoClient.connect(
            `${process.env.MONGO_URL}/hitachdut`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
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

async function getRound(league, season, round) {
    const db = await getDb();
    const games = await db
        .collection('rounds')
        .find({ league, season, round })
        .sort({ minDate: 1 })
        .toArray();

    if (games.length === 0) {
        return null;
    }

    return games[0];
}

async function getNextRound(date) {
    const db = await getDb();
    const games = await db
        .collection('rounds')
        .find({ minDate: { $gt: date } })
        .sort({ minDate: 1 })
        .toArray();

    if (games.length === 0) {
        return null;
    }

    return games[0];
}

async function getFirstIncompleteRound() {
    const db = await getDb();
    const games = await db
        .collection('rounds')
        .find({ isCompleted: false })
        .sort({ minDate: -1 })
        .toArray();

    if (games.length === 0) {
        return null;
    }

    return games[0];
}

async function insertRound(league, season, round, games) {
    const minDate = games.reduce(
        (prev, cur) => (cur.date < prev ? cur.date : prev),
        new Date('2040-01-01 00:00:00')
    );
    const isCompleted = !games.some(game => game.score == null);

    const db = await getDb();
    return await db.collection('rounds').updateOne(
        { league, season, round },
        {
            $set: { league, season, round, minDate, isCompleted, games },
            $currentDate: { lastModified: true },
        },
        { upsert: true }
    );
}

module.exports = Object.freeze({
    cleanup,
    insertRound,
    getFirstIncompleteRound,
    getNextRound,
    getRound,
});
