(function() {
    angular
        .module('loc8rApp')
        .service('loc8rData', loc8rData);

    loc8rData.$inject = ['$http', 'authentication'];
    function loc8rData($http, authentication) {
        var locationByCoords = function(lat, lng) {
            return $http.get('/api/v1/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
        };

        var locationById = function(locationId) {
            return $http.get('/api/v1/locations/' + locationId);
        }

        var addReviewByLocationId = function(locationId, data) {
            return $http.post('/api/v1/locations/' + locationId + '/reviews', data, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        }

        return {
            locationByCoords: locationByCoords,
            locationById: locationById,
            addReviewByLocationId: addReviewByLocationId
        };
    }
})();