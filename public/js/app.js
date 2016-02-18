//http://odetocode.com/blogs/scott/archive/2014/05/20/using-resolve-in-angularjs-routes.aspx

var app = angular.module('MyApp', ['ngRoute', 'authService', 'userService', 'storyService']).
	config([ '$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'views/pages/home.html'
			})
			.when('/login', {
				templateUrl : 'views/pages/login.html'
			})
			.when('/signup', {
				templateUrl : 'views/pages/signup.html'
			})
			.when('/searchstories', {
				templateUrl : 'views/pages/search.html'
			})
			.when('/allstories', {
				templateUrl : 'views/pages/allstories.html',
				controller : 'AllStoryController',
				resolve : {
					stories : function(Story) {
						return Story.getAllStories();
					}
				}
			})

			$httpProvider.defaults.timeout = 5000;
			$locationProvider.html5Mode(true);

			//Http Interceptor			
			$httpProvider.interceptors.push('AuthInterceptor');
			
	}])

	