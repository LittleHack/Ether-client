require('dotenv').config();
const config = require('../config').get(process.env.NODE_ENV);
const mongoose = require('mongoose');
require('../models/wallet');
const walletModel = mongoose.model('ethereumWallet');
const walletTools = require('./tools');
const Web3 = require('web3');
const Transaction = require('ethereumjs-tx');
const keythereum = require("keythereum");
const fs = require('fs');

const web3 = new Web3(new Web3.providers.HttpProvider(config.node_host));

// Function to create a wallet
// stores wallet in mongo and keystore file in 'keystorePath'
async function createWallet (req, res) {
    let password;
    if(req.body.password)
        password = req.body.password;
    else
        throw new Error('missing password')
    const dk = await keythereum.create();
    const keystore = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);
    const storePath = config.keystorePath + '/' + keystore.address + '.json';
    try {
        fs.writeFileSync(
            storePath,
            JSON.stringify(keystore)
        );
    } catch (err) {
        throw err;
    }

    // save wallet in mongo db
    const wallet = await walletModel({
        label: req.body.label,
        address: keystore.address,
        password: password
    }).save();

    return res.status(200).json(wallet.toObject());
}

async function getAllWallets (req, res) {
    let result = await walletTools.findAll();
    result = result.map((wallet) => {
        return wallet.toObject();
    });
    return res.status(200).json(result);
}

async function getWallet (req, res) {
    const params = req.params;
    let wallet;
    try {
        wallet = await walletTools.find(params.id);
    } catch (err) {
        return res.status(400).send({Error: 'Wallet not found'});
    }
    let balance;
    // Query blockchain for wallet balance
    try {
        balance = await web3.eth.getBalance(wallet.address);
    } catch (err){
        return res.status(400).send({Error: err.toString()});
    }
    let result = wallet.toObject();
    result.balance = balance;
    return res.status(200).json(result);
}

async function getWalletByAddress (req, res) {
    const params = req.params;
    let wallet;
    try {
        wallet = await walletTools.findByAddress(params.address);
    } catch (err) {
        return res.status(400).send({Error: err.toString()});
    }
    let balance;
    // Query blockchain for wallet balance
    try {
        balance = await web3.eth.getBalance(wallet.address);
    } catch (err){
        return res.status(400).send({Error: err.toString()});
    }
    let result = wallet.toObject();
    result.balance = balance;
    return res.status(200).json(result);
}

async function getPrivateKey(address, password) {
    let keystore;
    try {
        keystore = keythereum.importFromFile(address, './');
    } catch (err) {
        throw err;
    }
    var privateKey = await keythereum.recover(password, keystore);
    return privateKey;
}

async function sendTransaction (req, res) {
    let pKey;
    try {
        pKey = await getPrivateKey(req.body.from, req.body.password);
    } catch (err) {
        return res.status(400).send({Error: err.toString()});
    }

    var txValue = web3.utils.numberToHex(web3.utils.toWei('0.1', 'ether'));
    var txData = web3.utils.asciiToHex('hello world');

    var rawTx = {
        nonce: '0x0', // Nonce is the times the address has transacted, should always be higher than the last nonce 0x0#
        gasPrice: '0x14f46b0400', // Normal is '0x14f46b0400' or 90 GWei
        gasLimit: '0x55f0', // Limit to be used by the transaction, default is '0x55f0' or 22000 GWei
        to: '0x' + req.body.to, // The receiving address of this transaction
        value: txValue, // The value we are sending '0x16345785d8a0000' which is 0.1 Ether
        data: txData // The data to be sent with transaction, '0x6f6820686169206d61726b' or 'hello world' 
    }

    const tx = new Transaction(rawTx);
    tx.sign(pKey);
    const serializedTx = tx.serialize();

    let result;
    try {
        result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    } catch (err) {
        return res.status(400).send({Error: err.toString()});
    }
    return result.json();
}

module.exports = {
    sendTransaction,
    createWallet,
    getWallet,
    getWalletByAddress,
    getAllWallets
}