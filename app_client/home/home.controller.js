(function() {
    angular
        .module('loc8rApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', 'loc8rData', 'geoLocation'];
    function homeController($scope, loc8rData, geoLocation) {
        console.log('home controller');
        var vm = this;
        vm.pageHeader = {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        };
        
        vm.sidebar = {
            content: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
        };

        vm.message = "Checking your location";

        vm.getData = function(position) {
            var lat = position.coords.latitude;
                lng = position.coords.longitude;

            vm.message = "Searching for nearby places";
            loc8rData.locationByCoords(lat, lng)
                .then(function successCallback(response) {
                    vm.message = response.data.length > 0 ? "" : "No locations found";
                    vm.data = {
                        locations: response.data
                    };
                }, function errorCallback(response) {
                    vm.message = "Sorry, something's gone wrong";
                });
        };

        vm.showError = function(error) {
            $scope.$apply(function() {
                vm.message = error.message;
            });
        };

        vm.noGeo = function() {
            $scope.$apply(function() {
                vm.message = "Geolocation not supported by this browser.";
            });
        };

        geoLocation.getPosition(vm.getData, vm.showError, vm.noGeo);
    }
})();