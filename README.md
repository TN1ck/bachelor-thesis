# Infoboard

## What is this?

This is my bachelor thesis, which I wrote in 2015. I finally came around to adjust some small things to open source it.
Because this project used some internal backend services, the application shown here is not complete, but you should get an idea.
When I have time I will try to replicate the internal backend services with reddit.

Currently not working:

* No authentication, you can simply login with every username you want
* Favouriting and voting are not persisted

Nice things for the future:
* Build the assets on the server instead of commiting them
* CI

For more information, you can read my BA which can be found in tex/thesis.pdf. It's in german though.

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
