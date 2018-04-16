(function() {
    angular
        .module('loc8rApp')
        .service('authentication', authentication);

    const TOKEN_NAME = 'loc8r-token';
    const DELIMITER = '.';

    authentication.$inject = ['$http', '$window']
    function authentication($http, $window) {
        var saveToken = function(token) {
            $window.localStorage[TOKEN_NAME] = token;
        };

        var getToken = function() {
            return $window.localStorage[TOKEN_NAME];
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
            $window.localStorage.removeItem(TOKEN_NAME);
        };

        var isLoggedIn = function() {
            var token = getToken();
            
            if (token) {
                var payload = JSON.parse($window.atob(token.split(DELIMITER)[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split(DELIMITER)[1]));

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