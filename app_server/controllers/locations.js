var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://ancient-basin-43355.herokuapp.com/';
}

var _formatDistance = function(distance) {
  var convertedDistance, unit;
  if (distance > 1) {
    convertedDistance = parseFloat(distance).toFixed(1);
    unit = 'km';
  } else {
    convertedDistance = parseInt(distance * 1000, 10);
    unit = 'm';
  }

  return convertedDistance + unit;
}

var _showError = function(req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found :(";
    content = "Oh dear. Look like something went wrong.";
  } else {
    title = status + ", somethings went wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }

  res.status(status);
  res.render('generic-text', {
    title: title,
    content: content
  });
}

var getLocationInfo = function(req, res, callback) {
  var path = "/api/v1/locations/" + req.params.locationId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };

  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng : body.coords[0],
          lat: body.coords[1]
        };
        callback(req, res, data);
      } else { 
        _showError(req, res, body.statusCode);
      }
    }
  );
}

var renderHomepage = function(req, res, responseBody) {
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }

  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations: responseBody,
    message: message
  })
}

/* GET 'home' page */
var homelist = function(req, res) {
  var path = '/api/v1/locations';
  var requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {
      lng: -0.9690884,
      lat: 51.455041,
      maxDistance: 20
    }
  };

  request(requestOptions, function(err, response, body) {
    var i
    var data = body;
    if (response.statusCode === 200 && data.length) {
      for (i = 0; i < data.length; i++) {
        data[i].distance = _formatDistance(data[i].distance);
      }
    }

    renderHomepage(req, res, data);
  });
};

var renderLocationDetail = function(req, res, location) {
  res.render('location-info', {
    title: location.name,
    pageHeader: {
      title: location.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: location
  });
};

/* GET 'Location info' page */
var locationInfo = function(req, res) {
  getLocationInfo(req, res, function(req, res, responseData) {
    renderLocationDetail(req, res, responseData);
  });
}

var renderReviewForm = function(req, res, location) {
  res.render('location-review-form', {
    title: 'Review ' + location.name + ' on Loc8r',
    pageHeader: {title: 'Review ' + location.name},
    id: location._id,
    error: req.query.err
  })
};

/* GET 'Add review' page */
var addReview = function(req, res) {
  getLocationInfo(req, res, function(req, res, responseData) {
    renderReviewForm(req, res, responseData);
  });
};

/* POST 'Add review' page */
var doAddReview = function(req, res) {
  console.log('doAddReview');
  var locationId = req.params.locationId;
  var path = '/api/v1/locations/' + locationId + '/reviews';
  var postData = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.text
  };

  var requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postData
  };

  if (!postData.author || !postData.rating || !postData.reviewText) {
    res.redirect('location/' + locationId + '/review/new?err=val');
  } else {
    request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 201) {
          res.redirect('/location/' + locationId);
        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
          res.redirect('/location/' + locationId + '/reviews/new?err=val');
        } else {
          _showError(req, response.statusCode);
        }
      }
    );
  }
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview
};