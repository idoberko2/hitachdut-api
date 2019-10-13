const { cleanup } = require('./client');
const {
    getFirstIncompleteRound,
    getNextRound,
    getRound,
    insertRound,
} = require('./roundsCollection');

module.exports = Object.freeze({
    cleanup,
    getFirstIncompleteRound,
    getNextRound,
    getRound,
    insertRound,
});
