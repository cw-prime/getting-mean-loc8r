(function() {
    angular
        .module('loc8rApp')
        .controller('locationDetailController', locationDetailCtrl);

    locationDetailCtrl.$inject = ['$routeParams', 'loc8rData']
    function locationDetailCtrl($routeParams, loc8rData) {
        var vm = this;

        vm.locationId = $routeParams.locationId;
        loc8rData.locationById(vm.locationId)
            .then(function successCallback(response) {
                vm.data = {
                    location: response.data
                };

                vm.pageHeader = {
                    title: vm.data.location.name
                }
            }, function errorCallback(response) {
                console.log(response);
            });
    }
})();