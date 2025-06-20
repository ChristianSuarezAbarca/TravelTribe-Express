const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();

const travels = require(__dirname + '/routes/travel');
const users = require(__dirname + '/routes/auth');
const realUsers = require(__dirname + '/routes/user');

mongoose.connect('mongodb://localhost:27017/TravelTribe');

let app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json({ limit: '5mb' }));

app.use('/travels', travels);
app.use('/auth', users);
app.use('/users', realUsers);

app.listen(8080);
