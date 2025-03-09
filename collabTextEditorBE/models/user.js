const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: { type: String, required: true, unique: true},
    username: { type: String, required: true},    
    publicKey: { type: String, required: false},
    gistUrl: {type: String, required: false}, 
});

const User = mongoose.model('User',userSchema);

module.exports = User;