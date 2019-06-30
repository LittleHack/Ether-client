### Ethereum wallet manager

## How to run
run mongod locally
cp env.example .env
npm i
npm start

## Endpoints 

/wallets -> return all wallets in database
/wallet/:id -> return wallet matching an id
/wallet/address/:address -> return wallet matching an address
/wallet/transfer -> send transfer
