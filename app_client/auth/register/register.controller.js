(function() {
    angular
        .module('loc8rApp')
        .controller('registerController', registerController);

    registerController.$inject = ['$location', 'authentication']
    function registerController($location, authentication) {
        var vm = this;

        vm.pageHeader = {
            title: 'Create a new Loc8r account'
        };

        vm.credentials = {
            name: "",
            email: "",
            password: ""
        };

        vm.returnPage = $location.search().page || '/';

        vm.onSubmit = function() {
            vm.formError = "";

            if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
                vm.formError = "All fields are required, please try again";
                return false;
            } else {
                vm.doRegister();
            }
        };

        vm.doRegister = function() {
            vm.formError = "";
            authentication
                .register(vm.credentials)
                .then(function successCallback(response) {
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                }, function errorCallback(response) {
                    vm.formError = response.data ;
                });
        };
    }
})();