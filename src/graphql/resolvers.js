const { getRound, getNextRound } = require('../store');
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = Object.freeze({
    Query: {
        round: async (obj, args, context, info) => {
            return await getRound(args.league, args.season, args.round);
        },
        nextRound: async (obj, args, context, info) =>
            await getNextRound(new Date(args.timestamp * 1000)),
    },
    DateTime: GraphQLDateTime,
});
