# elevate-demo
Nodejs server and mongo db

in .env add the following:
NODE_ENV = development
PORT = 8080
MONGO_URI="mongo connection string"
HMAC_KEY="generated hmac from the merchant account webhook in the Adyen C/A"

Paste these env variables into the Heroku app under 'Add environment variables'
