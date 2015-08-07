# Setup

1. install node.js and npm. on osx with brew via: `brew install npm`
2. (install mysql, this is not required but recommended)

## Frontend

In the `livewall/frontend` directory:

1. `npm install`
2. `npm start`

This will make the site available at `http://localhost:3000`.

### Production Build

The optimized production-build can be created like this:

1. `npm install` (if not done previously)
2. `node webpack-build`
2. `mkdir dist && cp index.html ./dist && mv build ./dist/build`

This will create a folder named `dist` where all relevant files are put into.
Currently the backend is able to serve the static-files, if you haven't changed the project-structure it should
work if you start the backend. To deploy it independently, simple copy the dist-directory
onto a file server.

Before building for production, you must set `settings.SERVER_URL`.
It can be found in `livewall/frontend/scripts/settings.js`.
This settings specifies how the frontend will communicate with the backend.

## Backend

In the `livewall/backend` directory:

1. `npm install`
2. if you use mysql you must create a user and a database:
```
mysql -uroot
CREATE DATABASE livewall;
CREATE USER 'livewalluser'@'localhost' IDENTIFIED BY 'dai2015';
GRANT ALL PRIVILEGES ON livewall.* To 'livewalluser'@'localhost' IDENTIFIED BY 'dai2015';
FLUSH PRIVILEGES;
```
`livewall`, `livewalluser` and `dai2015` are the current default settings.
And can be changed as needed in the `config`-directory.
3. Execute `node commands/sync.js` to create the tables.
4. additionally fill the database with mock-data: `node commands/fill.js`
5. `npm start`

Configuration of the backend is done via the files in the `config`-directory.

The server will locally listen to port `4000`. You need to make it public
available using servers like apache or nginx. The public-URL must conform with `settings.SERVER_URL`
set in `livewall/frontend/scripts/settings.js`.
