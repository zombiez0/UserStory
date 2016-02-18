app.controller('SearchController', ['$scope', 'Story', function($scope, Story){
	
	
	var self = this;
	self.searchTxtObj = {};
	self.searchResults = [];

	self.doSearch = function() {
		self.searchResults = [];
		console.log(self.searchTxtObj);
		Story.searchStory(self.searchTxtObj).success(function(data) {
			self.searchResults = data;
		}).error(function(errorData){
			console.log("Error in search");
		});
	}



}]);

