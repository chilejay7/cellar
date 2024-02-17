const express = require('express');
const cors = require('cors');
const { ApolloServer } = require ('@apollo/server');
const { expressMiddleware } = require('@apollo/server');
const path = require('path');
const morgan = require('morgan');

const db = require('./config/connection');

const PORT = process.env.PORT || 7075;
const app = express();

const { authMiddleware } = require('./utils/auth');

app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:7070",
        "https://urlofdeployedapp",
        "http://urlofdeployedapp",
    ]
}
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

morgan.token('host', function(req, res) {
    console.log(`Hostname: ${req.hostname}`);
    return req.hostname;
});

app.use(morgan(':method :host :status'));

app.use((req, res, next) => {
    console.log(`Request received on ${PORT}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Testing server successful!')
})

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running and listening on ${PORT}`);
    });
});
