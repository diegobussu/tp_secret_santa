const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let userSchema = new Schema ({
    email: {
        type: String,
        required : true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Boolean,
        required: true
    }
});

// hash avant de save en base de donnée
userSchema.pre('save', async function(next) {
    const user = this;
    try {
        // valeur par défaut de l'algo de hash : 10
        const algo = await bcrypt.genSalt(10);
        const hashPw = await bcrypt.hash(user.password, algo);
        user.password = hashPw;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('User', userSchema);