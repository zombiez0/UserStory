angular.module('authService', [])
	app.factory('Auth', ['$http', '$q', 'AuthToken', function($http, $q, AuthToken) {

		var authFactory = {};

		authFactory.login = function(username, password) {
			return $http.post('/api/login', {
				username : username,
				password : password
			})
			.success(function(data){
				AuthToken.setToken(data.token);
				return data;
			});
		}

		authFactory.logout = function(){
			AuthToken.setToken();
		}

		authFactory.isLoggedIn = function(){
			if(AuthToken.getToken()!='undefined' && AuthToken.getToken()!=null && AuthToken.getToken()!=undefined){
				return true;
			}else{
				return false;
			}
		}

		authFactory.getUser = function(){
			var token = AuthToken.getToken();
			if(token){
				return $http.get('/api/myinfo', {params : token});
			}else{
				return $q.reject({ message : "User has no token" });
			}
		}

		return authFactory;
	}]);

	app.factory('AuthToken', ['$window', function($window) {

		var authTokenFactory = {};

		authTokenFactory.getToken = function(){
			console.log("Token is : " + $window.localStorage.getItem('auth-token'));
			return $window.localStorage.getItem('auth-token');
		}

		authTokenFactory.setToken = function(token){
			console.log("Setting token : " + token);
			if(token){
				$window.localStorage.setItem('auth-token', token);
			}else{
				$window.localStorage.removeItem('auth-token');
			}
		}

		return authTokenFactory;

	}]);

	app.factory('AuthInterceptor', ['$q', '$location', 'AuthToken', function($q, $location, AuthToken){

		var interceptorFactory = {};

		interceptorFactory.request = function(config) {
			var token = AuthToken.getToken();
			if(token){
				config.headers['x-access-token'] = token;
			}
			return config;
		}

		interceptorFactory.responseError = function(response){
			if(response.error === 403) {
				$location.path('/login');
			}
			return $q.reject(response);
		}

		return interceptorFactory;
	}]);