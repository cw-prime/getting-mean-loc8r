var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});
var locationController = require('../controllers/locations');
var reviewController = require('../controllers/reviews');
var authenticationController = require('../controllers/authentication');

// Locations
router.get('/locations', locationController.locationListByDistance);
router.post('/locations', locationController.locationsCreate);
router.get('/locations/:locationId', locationController.locationsReadOne);
router.put('/locations/:locationId', locationController.locationsUpdateOne);
router.delete('/locations/:locationId', locationController.locationsDeleteOne);

// Reviews
router.post('/locations/:locationId/reviews', auth, reviewController.reviewsCreate);
router.get('/locations/:locationId/review/:reviewId', reviewController.reviewsReadOne);
router.put('/locations/:locationId/reviews/:reviewId', auth, reviewController.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId', auth, reviewController.reviewsDeleteOne);

// Authentication
router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);

module.exports = router;