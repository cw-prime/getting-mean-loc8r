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

}

module.exports.locationsUpdateOne = function(req, res) {

}


module.exports.locationsDeleteOne = function(req, res) {
    
}