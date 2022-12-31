const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkValidTourId,
  validateTourPayload,
} = require('../controllers/tourController');

router.param('id', checkValidTourId);
router.route('/').get(getAllTours).post(validateTourPayload, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
