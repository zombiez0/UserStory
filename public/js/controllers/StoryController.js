app.controller('StoryController', ['$location', 'Auth', '$scope', '$rootScope','Story', 'socketio', function($location, Auth, $scope, $rootScope, Story, socketio){
	
	$scope.storyData = {};
	$scope.message = '';
	$scope.storyContainer = [];

	$scope.createStory = function(){
		
		Story.createStory($scope.storyData).success(function(data) {
			if(data.success){
				//Clean up the form
				$scope.storyData = {};
			}else{
				$scope.message = data.message;
			}
		}).error(function(errorData){
			console.log(errorData)
		});
	}

	$scope.getStories = function(){
		
		Story.getStory().success(function(data) {
			$scope.storyContainer = [];
			$scope.storyContainer = data;
		}).error(function(errorData){
			console.log(errorData)
		});
	}

	socketio.on('story', function(data) {
		$scope.storyContainer.push(data)
	});

	$scope.initStory = function(){
		$scope.getStories();
	}

}]);

app.controller('AllStoryController', ['$scope', 'stories', 'socketio', function($scope, stories, socketio){

	$scope.allStories = stories.data || [];

	socketio.on('story', function(data) {
		$scope.allStories.push(data)
	});

}]);