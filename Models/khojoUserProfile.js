const mongoose = require('mongoose');

const khojoProfileSchema = new mongoose.Schema({
    pfp: {
        type: String,
        required: true
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
    Occupation: {
        type: String , // to be converted to array
        required: true
       
    },
    district: {
        type: String,
        required: true
    },
    User : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    theme_id : {
        type: String,
        required: true
    },
    template : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    }
});

module.exports = mongoose.model('KhojoProfile', khojoProfileSchema);
