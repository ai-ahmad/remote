const mongoose = require('mongoose');

const BannerSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('BannerWTC', BannerSchema);