const { getDb } = require('./client');

async function getRound(league, season, round) {
    const db = await getDb();
    const rounds = await db
        .collection('rounds')
        .find({ league, season, round })
        .sort({ minDate: 1 })
        .toArray();

    if (rounds.length === 0) {
        return null;
    }

    return rounds[0];
}

async function getNextRound(date) {
    const db = await getDb();
    const rounds = await db
        .collection('rounds')
        .find({ minDate: { $gt: date } })
        .sort({ minDate: 1 })
        .toArray();

    if (rounds.length === 0) {
        return null;
    }

    return rounds[0];
}

async function getFirstIncompleteRound() {
    const db = await getDb();
    const rounds = await db
        .collection('rounds')
        .find({ isCompleted: false })
        .sort({ minDate: 1 })
        .toArray();

    if (rounds.length === 0) {
        return null;
    }

    return rounds[0];
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

module.exports = {
    getFirstIncompleteRound,
    getNextRound,
    getRound,
    insertRound,
};
