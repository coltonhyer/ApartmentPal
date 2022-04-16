# ApartmentPal
Capstone project for Utah Valley University Department of Computer Science.

## Development
In order to run a develop server with vue run the following commands in the root of the directory:
```
npm run app:dev
```
```
npm run serve
```
This will compile your vue structure into a web server and serve it on port `8080`, you will still need to access the server which is why you start the app server as well

If you wish to run the app in development, remember to comment out the `app.use(express.static('dist'))` in `server.js` to avoid compiling unnecessary things

## Production
Production builds can be compiled by running the following command:
```
npm run build
```
This compiles the project into `dist` which will be served up by `server.js` 

The sever then runs on port 3000 (in a local environment) and serves those files there, so you can view them by pointing your browser on that port

## Stack
This project utilizes the `MEVN` stack. 

**MongoDB** - Stores and provides data for users to access

**Express** - Handles coordination between the frontend and database, serves up static files in production mode

**Vue** - Builds the frontend

**Node** - Used on the back-end to handle the request flow
