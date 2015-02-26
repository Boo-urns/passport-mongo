passport-mongo
==============

This repository serves as an example of a basic Node.js application which is using [Passport](http://passportjs.org/) as the authentication middleware for authenticating against a locally configured Mongo backend

Steps to run the app
=====================
* After cloning the repo, install the dependencies by running **npm install**
* To start the server, run **nodemon server.js** on the base directory
* If you don't have nodemon ```npm install -g nodemon```

Perquisites
============
The server assumes that you have a local mongo instance running. This means if you have mongo installed locally, all you need to do is configure the config.js file correctly and run the mongod daemon
