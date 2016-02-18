app.controller('UserController', ['$location', 'User', '$scope', '$rootScope','$window', function($location, User, $scope, $rootScope, $window){
	
	$scope.users = [];

	// User.all().success(function(data){
	// 	$scope.users = data;
	// });


}]);

app.controller('UserCreateController', ['$location', 'User', '$scope', '$rootScope','$window', function($location, User, $scope, $rootScope, $window){
	
	$scope.userData = {};
	$scope.message = '';
	
	$scope.signupUser = function(){
		User.createUser($scope.userData).then(function(response) {
			$scope.message = response.data.message;
			console.log(response.data)
			$window.localStorage.setItem('auth-token', response.data.token);
			$location.path('/');
		});
	}


}]);