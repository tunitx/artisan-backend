const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    //? we can add template preview image later ( to be stored in clpudinary)
    theme_id : {
        type: String,
        required: true
    },
    previewImageUrl:{
        type: String,
        required: true
    },
    
    cloudinaryLink: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Template', templateSchema);
