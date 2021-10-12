const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
    name: String,
    isEndangered: Boolean,
    dateOfEntry: {
        type: String,
        default: new Date().toLocaleTimeString()
    }
});

const Animal = mongoose.model('Animal', animalSchema);


module.exports = Animal;