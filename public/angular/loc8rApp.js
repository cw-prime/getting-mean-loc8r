angular.module('loc8rApp', []);

var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var formatDistance = function() {
    return function(distance) {
        var convertedDistance, unit;
        if ((distance || distance === 0) && _isNumeric(distance)) {
            if (distance > 1) {
                convertedDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            } else {
                convertedDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }

            return convertedDistance + unit;
        } else {
            return "?";
        }
    };
};

var ratingStars = function() {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: '/angular/rating-stars.html'
    };
};

var geoLocation = function() {
    var getPosition = function(successCallback, errorCallback, noGeoCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            noGeoCallback();
        }
    };

    return {
        getPosition: getPosition
    };
};

var loc8rData = function($http) {
    var locationByCoords = function(lat, lng) {
        return $http.get('/api/v1/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
    };

    return {
        locationByCoords: locationByCoords
    };
};

var locationListController = function($scope, loc8rData, geoLocation) {
    $scope.message = "Checking your location";
    
    $scope.getData = function(position) {
        var lat = position.coords.latitude;
            lng = position.coords.longitude;
            console.log('lat => ' + lat + ', lng => ' + lng);
        $scope.message = "Searching for nearby places";
        loc8rData.locationByCoords(lat, lng)
            .then(function successCallback(response) {
                $scope.message = response.data.length > 0 ? "" : "No locations found";
                $scope.data = {
                    locations: response.data
                };
            }, function errorCallback(response) {
                $scope.message = "Sorry, something's gone wrong";
            });
    };

    $scope.showError = function(error) {
        $scope.$apply(function() {
            $scope.message = error.message;
        });
    };

    $scope.noGeo = function() {
        $scope.$apply(function() {
            $scope.message = "Geolocation not supported by this browser.";
        });
    };

    geoLocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
}

angular.module('loc8rApp')
       .controller('locationListController', locationListController)
       .filter('formatDistance', formatDistance)
       .directive('ratingStars', ratingStars)
       .service('loc8rData', loc8rData)
       .service('geoLocation', geoLocation);