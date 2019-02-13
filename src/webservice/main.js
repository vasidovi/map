const express = require('express')
var bodyParser = require("body-parser");

const storage = require('./storage')

const app = express()
const port = 3000

app.use(bodyParser.json());

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

app.get('/map', asyncMiddleware(async (req, res, next) => {
    res.send(await storage.get('map'))
}))

app.post('/map', asyncMiddleware(async (req, res, next) => {
    console.log(req.body);
    await storage.set('map', req.body)
    res.sendStatus(201);
}))

app.listen(port, () => console.log(`App listening on port ${port}!`))