const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    images: {
        type: [],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    }
})


    
module.exports = mongoose.model('NewsWTC', NewsSchema);