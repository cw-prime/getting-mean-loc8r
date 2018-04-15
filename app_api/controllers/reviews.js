var mongoose = require('mongoose');
var locationModel = mongoose.model('Location');
var userModel = mongoose.model('User');

var getAuthor = function(req, res, callback) {
    if (req.payload && req.payload.email) {
        userModel
            .findOne({
                email: req.payload.email
            })
            .exec(function(err, user) {
                if (!user) {
                    sendJSONresponse(res, 404, {
                        "message": "User not found"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }

                callback(req, res, user.name);
            });
    } else {
        sendJSONresponse(res, 404, {
            "message": "User not found"
        });
        return;
    }
};

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var updateAverageRating = function(locationId) {
    locationModel
        .findById(locationId)
        .select('rating reviews')
        .exec(function(err, location) {
            if (!err) {
                setAverageRating(location);
            }
        });
}

var setAverageRating = function(location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        
        for (i = 0; i < reviewCount; i++) {
            ratingTotal += location.reviews[i].rating;
        }

        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Average rating updated to ", ratingAverage);
            }
        })
    }
}

var doAddReview = function(req, res, location, author) {
    if (!location) {
        sendJSONresponse(res, 404, {
            "message": "locationId not found"
        });
    } else {
        location.reviews.push({
            author: author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });

        location.save(function(err, location) {
            var review;
            if (err) {
                sendJSONresponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                review = location.reviews[location.reviews.length - 1];
                sendJSONresponse(res, 201, review);
            }
        });
    }
}

module.exports.reviewsReadOne = function(req, res) {
    if (req.params && req.params.locationId && req.params.reviewId) {
        locationModel.findById(req.params.locationId)
            .select('name reviews')
            .exec(function(err, location) {
                var response, review;
                if (!location) {
                    sendJsonReponse(res, 404, {
                        "message": "locationId not found"
                    });
                    return;
                } else if (err) {
                    sendJsonReponse(res, 404, err);
                    return;
                }
                
                if (!location.reviews && location.reviews.length > 0) {
                    review = location.review.id(req.params.reviewId);
                    if (!review) {
                        sendJsonReponse(res, 404, {
                            "message": "reviewId not found"
                        });
                    } else {
                        response = {
                            location: {
                                name: location.name,
                                id: req.params.locationId
                            },
                            review: review
                        };
                        sendJsonReponse(res, 200, response);
                    }
                } else {
                    sendJsonReponse(res, 404, {
                        "message": "No reviews found"
                    });
                }
            })
    } else {
        sendJsonReponse(res, 404, {
            "message": "No locationId in request"
        });
    }
}

module.exports.reviewsCreate = function(req, res) {
    getAuthor(req, res, function(req, res, username){
        var locationId = req.params.locationId;
        if (locationId) {
            locationModel
                .findById(locationId)
                .select('reviews')
                .exec(function(err, location) {
                    if (err) {
                        sendJSONresponse(res, 400, err);
                    } else {
                        doAddReview(req, res, location, username);
                    }
                })
        } else {
            sendJSONresponse(res, 404, {
                "message": "Not found, locationId required"
            });
        }
    });
}

module.exports.reviewsUpdateOne = function(req, res) {
    if (!req.params.locationId || !req.params.reviewId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationId and reviewId are both required"
        });
        return;
    }

    locationModel
        .findById(req,params.locationId)
        .select('reviews')
        .exec(function(err, location) {
            var review;
            if (!location) {
                sendJSONresponse(res, 404, {
                    "message": "locationId not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 404, err);
                return;
            }

            if (location.reviews && location.reviews.length > 0) {
                review = locations.reviews.id(req.params.reviewId);
                if (!review) {
                    sendJSONresponse(res, 404, {
                        "message": "reviewId not found"
                    });
                } else {
                    review.author = req.body.author;
                    review.rating = req.body.rating;
                    review.reviewTest = req.body.reviewText;

                    location.save(function(err, location) {
                        if (err) {
                            sendJSONresponse(res, 404, err);
                        } else {
                            updateAverageRating(location._id);
                            sendJSONresponse(res, 200, review);
                        }
                    });
                }
            } else {
                sendJSONresponse(res, 404, {
                    "message": "No review to update"
                });
            }
        });
}

module.exports.reviewsDeleteOne = function(req, res) {
    if (!req.params.locationId || !req.params.reviewId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationId and reviewId are both required"
        });
        return;
    }

    locationModel
        .findById(req,params.locationId)
        .select('reviews')
        .exec(function(err, location) {
            var review;
            if (!location) {
                sendJSONresponse(res, 404, {
                    "message": "locationId not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 404, err);
                return;
            }

            if (location.reviews && location.reviews.length > 0) {
                locations.reviews.id(req.params.reviewId).remove();

                location.save(function(err, location) {
                    if (err) {
                        sendJSONresponse(res, 404, err);
                    } else {
                        updateAverageRating(location._id);
                        sendJSONresponse(res, 204, review);
                    }
                });
            } else {
                sendJSONresponse(res, 404, {
                    "message": "No review to delete"
                });
            }
        });
}