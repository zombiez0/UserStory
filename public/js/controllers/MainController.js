app.controller('MainController', ['$location', 'Auth', '$scope', '$rootScope','$window', function($location, Auth, $scope, $rootScope, $window){
	
	$scope.loginData = {};
	$scope.userInfo = null;
	$scope.isLoggedIn;
	$scope.message = '';

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		console.log("route changed");
		if(Auth.isLoggedIn()){
			$scope.isLoggedIn = true;
			if($scope.userInfo === null || $scope.userInfo === undefined){
					Auth.getUser().then(function(userData) {
					$scope.userInfo = userData.data;
					console.log("User Info is : ");
					console.log($scope.userInfo);
				});
			}			
		}else{
			$scope.isLoggedIn = false;
		}
	});

	$scope.doLogin = function(){
		var isLoading = false;
		Auth.login($scope.loginData.username, $scope.loginData.password).success(function(data) {
			isLoading = false;

			// Auth.getUser().then(function(data) {
			// 	$scope.userInfo = data;
			// 	console.log($scope.userInfo);
			// })

			if(data.success){
				$scope.userInfo = data.user;
				$location.path('/');
			}else{
				$scope.message = data.message;
			}
		}).error(function(errorData){
			console.log(errorData)
		});
	}

	$scope.doLogout = function(){
		Auth.logout();
		$location.path('/');
	}


}]);

app.filter('datecompare', function($filter) {
	return function(obj) {
		
		var filteredDates = [];
		angular.forEach(obj, function(item) {
			filteredDates.push(item);
		});

		filteredDates.sort(function(d1, d2) {
			var a = new Date(d1.created);
			var b = new Date(d2.created);
				return ((a > b) - (a < b));
		});
		return filteredDates.reverse();

	}
});