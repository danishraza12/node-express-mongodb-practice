const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
/* We coulve doe this using a function and called it inside all the relevant function but that 
would go against express's philosophy as all controller should do only what they are designed for 
and checking 'id' validity is not their purpose*/
exports.checkID = (req, res, next, val) => {
  console.log(`The 'id' is: ${val} `);
  //need to convert string(id) to int by multiplying with 1
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Failed!',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
  // Converting the passed parameter from string into integer
  const id = req.params.id * 1;
  // Getting the tour with the specified id
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour will be sent here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  /* Status Code 204 means No Content as we have deleted the record, we
      also donot return any data from delete methods so we return null*/
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
