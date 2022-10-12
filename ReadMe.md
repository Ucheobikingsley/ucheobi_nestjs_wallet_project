To Get Started,

STEP 1
    * run "npm install"
    * Configure Database
      - Create a new database on postgress "nest_testdb"
    * run "npm run start:dev" to start server
STEP 2 - api documentation/routing
 Our service uses Bearer Token Authentication Model so each 
 endpoint requires a Bearer Token Authentication except the POST "http://localhost:3000/user"
  - Register user
    entpoint: "http://localhost:3000/user"
    method: "POST"
    body: {
    "name":"david bliss",
    "email":"db@gmail.com", 
    "password": "ucheobi", 
    "phonenumber":"090293212"
    }
  - Login
    endpoint: "http://localhost:3000/user/login"
    method: "POST"
    body: {
    "phonenumber":"090293212",
    "password":"ucheobi"
    }
  - Create Wallet
    endpoint: "http://localhost:3000/user/wallet"
    method: "POST"
    body: {
    "currency": "UK"
    } 
  - Fund My wallet
    endpoint: "http://localhost:3000/user/wallet/me"
    method: "PATCH"
    body: {
    "walletId": "5",
    "amount": "100"
    }
  - Send Funds
    endpoint: "http://localhost:3000/user/wallet/send"
    method: "PATCH"
    body: {
    "senderWalletId": "5",
    "receiverWalletAddress": "48e59057-ce60-4f54-86d4-b3df7c23c107",
    "amount": "1100000"
    }
  - Approve Transfer over 1000000
    endpoint: "http://localhost:3000/user/wallet/approval"
    method: "PATCH"
    body: {
    "transactionId": "4"
    }


