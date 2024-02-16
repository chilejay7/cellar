const express = require('express');
const cors = require('cors');
const { ApolloServer } = require ('@apollo/server');
const { expressMiddleware } = require('@apollo/server');
const path = require('path');

const db = require('./config/connection');

const PORT = process.env.PORT || 7075;
const app = express();

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

app.use((req, res, next) => {
    console.log(`Request received on ${PORT}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Testing server successful!')
})

app.listen(PORT, () => {
    console.log(`Server running and listening on ${PORT}`);
});