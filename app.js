//////////////////////   This file contains all the code(not refactored) /////////////////////////////

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

///////////////////     1)  MIDDLEWARE     ///////////////////////

app.use(morgan('dev'));

/* this is a middleware which is used to parse the request and place the data 
sent to the API on the 'req' param and make it avaiable on the body property */
app.use(express.json());

// Custom Middleware
app.use((req, res, next) => {
  console.log('Hello from the api middleware!!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //We need to call next to keep the req/resp cycle going
  next();
});

///////////////////     2)  ROUTE HANDLERS/CONTROLLERS     ///////////////////////

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  // Converting the passed parameter from string into integer
  const id = req.params.id * 1;
  // Getting the tour with the specified id
  const tour = tours.find((el) => el.id === id);

  // Checking if user has requested a valid tour
  if (id > tours.length || !tour) {
    return res.status(404).json({
      status: 'Failed!',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  //creating new ID for new element by getting id of last element in tours
  const newID = tours[tours.length - 1].id + 1;
  // Adding new ID to the tour sent via the request
  const newTour = Object.assign({ id: newID }, req.body);
  // Adding new tour to the tours array of objects
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // sending status codes, message along with data is a good practice, 201 means created
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Failed!',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour will be sent here>',
    },
  });
};

const deleteTour = (req, res) => {
  //need to convert string(id) to int by multiplying with 1
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Failed!',
      message: 'Invalid ID',
    });
  }
  /* Status Code 204 means No Content as we have deleted the record, we
  also donot return any data from delete methods so we return null*/
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

///////////////////     3)  ROUTES     ///////////////////////

/* Making endpoints like this is messy and if we need to 
change the url we will need to change it everywhere 

// Get all the tours
app.get('/api/v1/tours', getAllTours);

// API path/name can be exactly same as the API Method will allow it
// to differentiate b/w the call to the methods, express does not put
// the data sent to the POST API on 'req' so we need to use middleware
app.post('/api/v1/tours', createTour);

// Get only one tours data, we have defined a variable 'id' which will
// catch the passed value in URL (127.0.0.1:3000/api/v1/tours/5) so id=5.
// Optional parameters can also be defined 127.0.0.1:3000/api/v1/tours/:id/:x/:y? 'y' is optional
app.get('/api/v1/tours/:id', getTour);

// Doesnot actually update anything, only here for practice
app.patch('/api/v1/tours/:id', updateTour);

// Doesnot actually update anything, only here for practice
app.delete('/api/v1/tours/:id', deleteTour); */

/* Better way to register endpoints using chaining
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser); */

/* REGISTER ROUTES USING MIDDLEWARE AND SEPARATING INTO DIFFERENT ROUTERS */

const tourRouter = express.Router();
const userRouter = express.Router();

// Mounting the routers, should be done after declaring the variables
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

///////////////////     4)  SERVER     ///////////////////////

port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
