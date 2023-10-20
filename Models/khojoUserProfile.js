const mongoose = require('mongoose');

const khojoProfileSchema = new mongoose.Schema({
    pfp: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    businessAddress: {
        type: String,
        required: true
    },
    businessDetails: {
        type: String,
        required: true
    },
    socialLinks: {
        type: Map, //to be converted to to an array of objects or a normal object
        required: true
       
    },
    skills: {
        type: [String], // to be converted to array
        required:false
       
    },
    district: {
        type: String,
        required: true
    },
    User : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    theme : {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('KhojoProfile', khojoProfileSchema);
