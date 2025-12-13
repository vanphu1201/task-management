require('dotenv').config()

const express = require("express");

const database = require("./config/database");

const routeApiV1 = require("./api/v1/routes/index.route");

const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json())

database.connect();

// Route Version 1
routeApiV1(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})