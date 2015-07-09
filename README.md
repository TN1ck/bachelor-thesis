# Setup

1. install node.js and npm. on osx with brew via: `brew install npm`
2. (install mysql, this is not required but recommended)

## Frontend

In the `livewall/frontend` directory:

1. `npm install`
2. `npm start`

## Backend

In the `livewall/backend` directory:

1. `npm install`
2. if you use mysql: `mysql -uroot`, `create database livewall`, `create user test`, `grant user ....`
3. `node commands/sync.js`
4. additionally fill the database with mock-data: `node commands/fill.js`
5. `npm start`

Configuration of the backend is done via the files in the `config`-directory.
