# Infoboard

## Setup

1. install node.js and npm. on osx with brew via: `brew install npm`
2. (install mysql, this is not required but recommended)

### Frontend

#### Developer Build

In the `infoboard/frontend` directory:

1. `npm install`
2. `npm start`

This will make the site available at `http://localhost:3000`.

#### Production Build

The optimized production-build can be created like this:


1. first make sure `settings.js` is configured correctly, normally you have to change the `SERVER_URL`, everytime you want to change a setting you have to rebuild
1. `npm install` (if not done previously)
2. `node webpack-build`
2. `rm -rf dist`
2. `mkdir dist && cp index.html ./dist && mv build ./dist/build`

This will create a folder named `dist` where all relevant files are put into.
Currently the backend is able to serve the static-files, if you haven't changed the project-structure it should
work if you start the backend. To deploy it independently, simple copy the dist-directory
onto a file server.

Before building for production, you must set `settings.SERVER_URL`.
It can be found in `infoboard/frontend/scripts/settings.js`.
This settings specifies how the frontend will communicate with the backend.

### Backend

In the `infoboard/backend` directory:

1. `npm install`
2. if you use mysql you must create a user and a database:
```
mysql -uroot
CREATE DATABASE infoboard;
CREATE USER 'infoboarduser'@'localhost' IDENTIFIED BY 'dai2015';
GRANT ALL PRIVILEGES ON infoboard.* To 'infoboarduser'@'localhost' IDENTIFIED BY 'dai2015';
FLUSH PRIVILEGES;
```
`infoboard`, `infoboarduser` and `dai2015` are the current default settings.
And can be changed as needed in the `config`-directory.
3. Execute `node commands/sync.js` to create the tables based on the specified model (to be found in `/models`) and delete all data.
4. additionally fill the database with mock-data: `node commands/fill.js`
5. `npm start`

Configuration of the backend is done via the files in the `config`-directory.

The server will locally listen to port `4000`. You need to make it public
available using servers like apache or nginx. The public-URL must conform with `settings.SERVER_URL`
set in `infoboard/frontend/scripts/settings.js`.

### Special notes for Apache
When you get an error like this:
```
WebSocket connection to 'ws://infoboard.dai-labor.de/socket.io/?EIO=3&transport=websocket&sid=Ma1hdJRCrtqxtEMFAAAH' failed: Error during WebSocket handshake: Unexpected response code: 400
```
It means that Websockets aren't working and you need to upgrade Apache to 2.4 and install the module `mod_proxy_wstunnel`.
