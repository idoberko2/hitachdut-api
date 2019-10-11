module.exports = `
    scalar DateTime

    type Game {
        date: DateTime
        homeTeam: String
        guestTeam: String
        stadium: String
        score: String
    }

    type Round {
        league: String
        round: String
        season: String
        isCompleted: Boolean
        games: [Game]
    }

    type Query {
        round(league: String!, season: String!, round: String!): Round
        nextRound(timestamp: Int!): Round
    }
`;
