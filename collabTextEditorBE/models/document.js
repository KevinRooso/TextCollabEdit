const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, // encrypted content
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    collaborators: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        encryptedAESKey: { type: String, required: true },  // AES key encrypted with the collaborator's RSA public key
    }],
    encryptedOwnerAESKey: { type: String, required: true },  // AES key encrypted with the owner's RSA public key
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    iv: { type: String, required: false },  // The same IV used for AES encryption
})

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;