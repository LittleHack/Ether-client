const mongoose = require('mongoose');
require('../models/wallet');
const walletModel = mongoose.model('ethereumWallet');

const findAll = async () => {
    return await walletModel.find({});
};

const find = async (id) => {
    return await walletModel.findById(id);
};

const findByAddress = async (address) => {
    return await walletModel.findOne({ address: address });
};

const remove = async () => {
    return await walletModel.deleteMany();
}

module.exports = {
    findAll,
    find,
    findByAddress,
    remove
};