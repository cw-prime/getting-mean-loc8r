(function() {
    angular
        .module('loc8rApp')
        .controller('navigationController', navigationController);

    navigationController.$inject = ['$window', '$location', 'authentication']
    function navigationController($window, $location, authentication) {
        var vm = this;

        vm.currentPath = $location.path();

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();

        vm.logout = function() {
            authentication.logout();

            if (vm.currentPath === '/') {
                $window.location.reload();
            } else {
                $location.path('/');
            }
        };
    }
})();