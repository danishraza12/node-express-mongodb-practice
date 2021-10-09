///////////////////     SERVER     ///////////////////////

/* Environment variables need to be read before we require the app 
file and are aviable everywhere in the process once read */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// configuring our .env file path to make it available in our project
dotenv.config({ path: './config.env' });

const app = require('./refactored');

//console.log(process.env); // view all env variables

const port = process.env.PORT || 3000;

//Connect to Database
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log('Connected to the Database');
});

app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
