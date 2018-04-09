(function() {
    angular
        .module('loc8rApp')
        .filter('formatDistance', formatDistance);

    var _isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function formatDistance() {
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
    }
})();