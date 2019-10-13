const { getDb } = require('./client');

const ROUNDS_COLLECTION = 'rounds';

async function init() {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    const roundsCollectionExists = collections.some(
        ({ name }) => name === ROUNDS_COLLECTION
    );

    if (!roundsCollectionExists) {
        const roundsCollection = await db.createCollection(ROUNDS_COLLECTION);
        await roundsCollection.createIndex(
            { minDate: -1 },
            { name: 'round_min_date_idx' }
        );
        await roundsCollection.createIndex(
            { league: 1, season: 1, round: -1 },
            { name: 'round_uniqueness', unique: true }
        );
        console.log('DB created successfully');
    } else {
        console.log('DB is already initialized');
    }
}

module.exports = init;
