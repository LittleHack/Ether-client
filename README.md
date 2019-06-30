### Ethereum wallet manager

## How to run
run mongod   
cp env.example .env  
npm i  
npm start  

## Endpoints 
GET :  
/wallets -> return all wallets in database  
/wallet/:id -> return wallet matching an id  
/wallet/address/:address -> return wallet matching an address  
POST : 
Format - JSON  
/wallet/create -> create a new wallet  { "password" : "77777777" }  
/wallet/transfer -> send transfer  { "from": "addr", "to": "addr", "amount": "100" }  
