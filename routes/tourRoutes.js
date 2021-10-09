const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// adding param 'id' so that it will run this functions code whenever a req is hit with 'id' as param
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  // middleware added to the 'post' function
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
