(function() {
    angular
        .module('loc8rApp')
        .controller('locationDetailController', locationDetailCtrl);

    locationDetailCtrl.$inject = ['$routeParams', '$uibModal', '$location', 'loc8rData', 'authentication']
    function locationDetailCtrl($routeParams, $uibModal, $location, loc8rData, authentication) {
        var vm = this;

        vm.locationId = $routeParams.locationId;

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentPath = $location.path();

        loc8rData.locationById(vm.locationId)
            .then(function successCallback(response) {
                vm.data = {
                    location: response.data
                };

                vm.pageHeader = {
                    title: vm.data.location.name
                }

                vm.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

            }, function errorCallback(response) {
                console.log(response);
            });

        vm.popupReviewForm = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/reviewModal/reviewModal.view.html',
                controller: 'reviewModalController as vm',
                resolve: {
                    locationData: function() {
                        return {
                            locationId: vm.locationId,
                            locationName: vm.data.location.name
                        };
                    }
                }
            });

            modalInstance.result.then(function(data) {
                vm.data.location.reviews.push(data);
            });
        };
    }
})();