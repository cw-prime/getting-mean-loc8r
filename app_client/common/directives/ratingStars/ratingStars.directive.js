(function() {
    angular
        .module('loc8rApp')
        .directive('ratingStars', ratingStars);

    function ratingStars() {
        return {restrict: 'EA',
            scope: {
                rating: '=rating'
            },
            templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
        };
    }
})();