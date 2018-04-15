(function() {
    angular
        .module('loc8rApp')
        .controller('loginController', loginController);

    loginController.$inject = ['$location', 'authentication']
    function loginController($location, authentication) {
        var vm = this;

        vm.pageHeader = {
            title: 'Sign in to Loc8r'
        };

        vm.credentials = {
            email: "",
            password: ""
        };

        vm.returnPage = $location.search().page || '/';

        vm.onSubmit = function() {
            vm.formError = "";

            if (!vm.credentials.email || !vm.credentials.password) {
                vm.formError = "All fields are required, please try again";
                return false;
            } else {
                vm.doLogin();
            }
        };

        vm.doLogin = function() {
            vm.formError = "";
            authentication
                .login(vm.credentials)
                .then(function successCallback(response) {
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                }, function errorCallback(response) {
                    vm.formError = response.data ;
                });
        };
    }
})();