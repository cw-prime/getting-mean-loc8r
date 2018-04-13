(function() {
    angular
        .module('loc8rApp')
        .service('geoLocation', geoLocation);

    function geoLocation() {
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
})();