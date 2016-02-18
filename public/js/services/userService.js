angular.module('userService', [])
	app.factory('User', function($http) {

		var userFactory = {};

		userFactory.createUser = function(userData) {
			return $http.post('/api/signup', {
				name : userData.name,
				username : userData.username,
				password : userData.password
			})

			return userFactory;
		}

		userFactory.all = function() {
			return $http.get('/api/users');
		}

		return userFactory;
	});