var express = require('express');
var router = express.Router();
var locationController = require('../controllers/locations');
var reviewController = require('../controllers/reviews');

// Locations
router.get('/locations', locationController.locationListByDistance);
router.post('/locations', locationController.locationsCreate);
router.get('/locations/:locationId', locationController.locationsReadOne);
router.put('/locations/:locationId', locationController.locationsUpdateOne);
router.delete('/locations/:locationId', locationController.locationsDeleteOne);

// Reviews
router.post('/locations/:locationId/reviews', reviewController.reviewsCreate);
router.get('/locations/:locationId/review/:reviewId', reviewController.reviewsReadOne);
router.put('/locations/:locationId/reviews/:reviewId', reviewController.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId', reviewController.reviewsDeleteOne);

module.exports = router;