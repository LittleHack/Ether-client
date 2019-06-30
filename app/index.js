require('dotenv').config();
const config = require('./config').get(process.env.NODE_ENV);
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const routes = require('./routes');

mongoose.connect(config.db, { useNewUrlParser: true });

// Add POST requests parsing with JSON body
app.use(express.json());
// Link all routes with app
app.use('/', routes);

module.exports = app.listen(config.port, () => {
    console.log('Application is live on port:', config.port);
});
