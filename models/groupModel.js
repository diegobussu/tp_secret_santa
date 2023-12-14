const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let groupSchema = new Schema ({
    user_id: {
        type: String,
        required : true,
        unique: true
    },
    name: {
        type: String, 
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    }
});

module.exports = mongoose.model('Group', groupSchema);