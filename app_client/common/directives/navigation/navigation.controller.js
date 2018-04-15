(function() {
    angular
        .module('loc8rApp')
        .controller('navigationController', navigationController);

    navigationController.$inject = ['$location', 'authentication']
    function navigationController($location, authentication) {
        var vm = this;

        vm.currentPath = $location.path();

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();

        vm.logout = function() {
            console.log('logout');
            authentication.logout();
            if (vm.currentPath === '/') {
                $location.reload();
            } else {
                $location.path('/');
            }
        };
    }
})();