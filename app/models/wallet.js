const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    label: String,
    address: String,
    password: String
});

walletSchema.set('toObject', {versionKey: false});

mongoose.model('ethereumWallet', walletSchema);