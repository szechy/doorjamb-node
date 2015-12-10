angular.module('PersonCtrl', []).controller('PersonController', function($scope, $http) {

	$scope.tagline = 'Power to the Users.';

	// hit the get route to fetch all nerds
	console.log('fetching people');
	$http.get('/api/persons')
		.success(function(data) {
			$scope.persons = data;
			/*console.log(data);
			for(var i = 0; i < data.length; i++)
				console.log(data[i]._id);*/
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	console.log('fetched people');

});