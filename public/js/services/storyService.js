angular.module('storyService', [])
	app.factory('Story', function($http) {
		var storyService = {};

		storyService.createStory = function(storyData){
			return $http.post('/api/', storyData);
		}

		storyService.getStory = function(){
			return $http.get('/api/');
		}

		storyService.getAllStories = function() {
			return $http.get('/api/all_stories');
		}

		storyService.searchStory = function(searchCriteria) {
			return $http.post('/api/search_stories', searchCriteria);
		}

		return storyService;
	})
	.factory('socketio', function($rootScope){
		var socket = io.connect();
		return {
			on : function(eventName, callback) {
				socket.on(eventName, function(){
					var args = arguments;
					$rootScope.$apply(function() {
						callback.apply(socket, args);
					});
				});
			},

			emit : function(eventName, data, callback) {
				socket.emit(eventName, data, function(){
					var args = arguments;
					$rootScope.$apply(function() {
						if(callback){
							callback.apply(socket, args);
						}
					});
				});
			}
		}
	});