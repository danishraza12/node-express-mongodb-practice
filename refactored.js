///////////////     COPY OF CODE IN app.js for refactor     ///////////////

const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

///////////////////      MIDDLEWARE     ///////////////////////

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // this is used to log our requests like POST /api/v1/tours 201 60.817 ms - 117
}
app.use(express.json());

// Allows us to access static files from a folder and not from a route
/* If express cannot find any file in the folder that we defined so it checks inside the public
folder so it is set as root by default so if we want ot access anything inside the public folder we
donot need to define the route to it, just directly write the file's name*/
app.use(express.static(`${__dirname}/public`));

// Custom Middleware
app.use((req, res, next) => {
  console.log('Hello from the api middleware!!');
  next();
});

//Since this is middleware we donot need to put it inside the tourRoutes file to use it
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/* REGISTER ROUTES USING MIDDLEWARE AND SEPARATING INTO DIFFERENT ROUTERS */
//These routers are alse middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
