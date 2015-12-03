angular.module('DoorCtrl', []).controller('DoorController', function($scope, $http) {

	$scope.tagline = 'Welcome to the House.';	

	// hit the get route to fetch all nerds
	console.log('fetching doors');
	$http.get('/api/doors')
		.success(function(data) {
			$scope.doors = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
});