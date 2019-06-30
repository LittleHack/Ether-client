const express = require('express');
const client = require('../client/client');
const routes = new express.Router({mergeParams: true});

routes.get('/wallet/:id', client.getWallet);
routes.get('/wallet/address/:address', client.getWalletByAddress);
routes.get('/wallets', client.getAllWallets);

routes.post('/wallet/create', client.createWallet);
routes.post('/wallet/transfer', client.sendTransaction);

module.exports = routes;