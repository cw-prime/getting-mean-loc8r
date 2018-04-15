(function() {
    angular
        .module('loc8rApp')
        .service('authentication', authentication);

    const TOKEN_NAME = 'loc8r-token';

    authentication.$inject = ['$http', '$window']
    function authentication($http, $window) {
        var saveToken = function(token) {
            $window.localStorage['loc8r-token'] = token;
        };

        var getToken = function() {
            console.log('getToken');
            return $window.localStorage['loc8r-token'];
        };

        var register = function(user) {
            return $http.post('/api/v1/register', user)
                .then(function successCallback(response) {
                    saveToken(response.data.token);
                });
        };

        var login = function(user) {
            return $http.post('/api/v1/login', user)
                .then(function successCallback(response) {
                    saveToken(response.data.token);
                });
        };

        var logout = function() {
            $window.localStorage.removeItem('loc8r-token');
        };

        var isLoggedIn = function() {
            var token = getToken();
            console.log('isLoggedIn: token: ' + token);
            
            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                console.log('isLoggedIn: payload: ' + payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };

        return {
            saveToken: saveToken,
            getToken: getToken,
            register: register,
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };
    }
})();