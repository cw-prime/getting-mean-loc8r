var mongoose = require('mongoose');
var locationModel = mongoose.model('Location');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

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

}

module.exports.reviewsUpdateOne = function(req, res) {

}

module.exports.reviewsDeleteOne = function(req, res) {

}