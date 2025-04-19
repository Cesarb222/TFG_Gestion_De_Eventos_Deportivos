const mongoose = require('mongoose');
const { mongoDB } = require('./keys');

mongoose.connect(mongoDB.URI)
    .then(db => console.log('DataBase TFG is connected'))
    .catch(err => console.log(err));
