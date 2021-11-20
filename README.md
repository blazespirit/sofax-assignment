# This is an assigment from SofaX interview

This project is created using `create-react-app` (https://github.com/facebook/create-react-app) and Google FireStore as backend data persistence.

## Tool needed to run this project

1. Install NodeJS (instruction here: https://nodejs.org/en/download/package-manager/)
2. You might need to update the NPM (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## How to get this run on your local machine

1. Clone this repo.
2. Go into the root folder.
3. Run `npm install` to install all the dependencies.
4. Run `npm run start` to run the development server.
5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the app.

# Firestore

This project use Google Firestore to persist the date. If you like to run this on your own Firestore instance, just follow this instruction (https://firebase.google.com/docs/firestore/quickstart) to create a new Firestore and update the config in `firestore.ts` to point it into your instance.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
