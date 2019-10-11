// external
const express = require('express');
const express_graphql = require('express-graphql');
const winston = require('winston');
const expressWinston = require('express-winston');

const schema = require('./graphql/schema');

const app = express();

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        expressFormat: true,
    })
);

app.use(
    '/graphql',
    express_graphql({
        schema,
        rootValue: {},
        graphiql: true,
    })
);

app.use((err, req, res, next) => {
    const { NODE_ENV } = process.env;

    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }

    if (NODE_ENV === 'production') {
        res.status(500).send('Error!');
    } else {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

module.exports = app;
