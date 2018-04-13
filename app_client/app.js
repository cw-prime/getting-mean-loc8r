(function() {
    angular.module('loc8rApp', ['ngRoute', 'ngSanitize']);

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/home/home.view.html',
                controller: 'homeController',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: '/common/views/genericText.template.html',
                controller: 'aboutController',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');
    }

    angular
        .module('loc8rApp')
        .config(['$routeProvider', '$locationProvider', config]);
})();