var mongoose = require('mongoose');
var locationModel = mongoose.model('Location');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var theEarth = (function() {
    var earthRadius = 6371 // in km

    var getDistanceFromRads = function(rads) {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function(distance) {
        return parseFloat(distance / earthRadius);
    };
});

module.exports.locationsReadOne = function(req, res) {
    if (req.params && req.params.locationId) {
        locationModel.findById(req.params.locationId)
            .exec(function(err, location) {
                if (!location) {
                    sendJsonReponse(res, 404, {
                        "message": "locationId not found"
                    });
                    return;
                } else if (err) {
                    sendJsonReponse(res, 404, err);
                    return;
                }
                sendJsonReponse(res, 200, location);
            })
    } else {
        sendJsonReponse(res, 404, {
            "message": "No locationId in request"
        });
    }
}

module.exports.locationListByDistance = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFlaot(req.query.lat);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(20),
        num: 10
    };
    if (!lng || !lat) {
        sendJSONresponse(res, 404, {
            "message": "lng and lat query parameters are required"
        });
        return;
    }
    locationModel.geoSearch(point, geoOptions, function(err, results, stats) {
        var locations = [];
        if (err) {
            sendJSONresponse(res, 404, err);
        } else {
            results.forEach(function(doc) {
                locations.push({
                    distance: theEarth.getDistanceFromRads(doc.dis),
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });
            sendJSONresponse(res, 200, locations);
        }
    });
}

module.exports.locationsCreate = function(req, res) {
    locationModel.create({
        name: req.body.name,
        address: req.body.address,
        facilites: req.body.facilites.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lng)],
        openingTimes: [{
            days: req.body.days1,
            oepning: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
        }, {
            days: req.body.days2,
            oepning: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }]
    }, function(err, location) {
        if (err) {
            sendJSONresponse(res, 400, err);
        } else {
            sendJSONresponse(res, 201, location);
        }
    });
}

module.exports.locationsUpdateOne = function(req, res) {
    if (!req.params.locationId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationId is required"
        });
        return;
    }

    locationModel
        .findById(req.params.locationId)
        .select('-reviews -rating')
        .exec(function(err, location) {
            if (!location) {
                sendJSONresponse(res, 404, {
                    "message": "locationId not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 400, err);
                return;
            }

            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(",");
            location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)],
            location.openingTimes = [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2
            }];

            location.save(function(err, location) {
                if (err) {
                    sendJSONresponse(res, 404, err);
                } else {
                    sendJSONresponse(res, 200, location);
                }
            });
        });
}

module.exports.locationsDeleteOne = function(req, res) {
    var locationId = req.params.locationId;
    if (locationId) {
        locationModel
            .findByIdAndRemove(locationId)
            .exec(function(err, location) {
                if (err) {
                    sendJSONresponse(res, 404, err);
                    return;
                }
                
                sendJSONresponse(res, 204, null);
            });
    } else {
        sendJSONresponse(res, 404, {
            "message": "No locationId found"
        });
    }
}