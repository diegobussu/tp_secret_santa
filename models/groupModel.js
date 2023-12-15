const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let groupSchema = new Schema({
    users: [
        {
            user_id: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                default: 'user',
                enum: ['user', 'admin'],
            },
        },
    ],

    name: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model('Group', groupSchema);
