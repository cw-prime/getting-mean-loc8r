angular.module('loc8rApp', []);

var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var formatDistance = function() {
    return function(distance) {
        var convertedDistance, unit;
        if (distance && _isNumeric(distance)) {
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

var locationListController = function($scope) {
    $scope.data = {
        locations : [{
            name: 'Starcups',
            address: '125 Royal Mile, Edinburgh, EH1',
            rating: 5,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '0.296456',
            _id: '537a35f2536f6785f8dfb6a'
        }, {
            name: 'Burger Queen',
            address: '125 Royal Mile, Edinburgh, EH1',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '0.496456',
            _id: '537a35f2536f6785f8dfb6b'
        }]
    }
}

angular.module('loc8rApp')
       .controller('locationListController', locationListController)
       .filter('formatDistance', formatDistance)
       .directive('ratingStars', ratingStars);