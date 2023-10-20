
//? User Schema for Auth and other add ons 

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    khojoUserProfiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KhojoProfile'
    }]
});




const User = mongoose.model('User', userSchema);

module.exports = User;
