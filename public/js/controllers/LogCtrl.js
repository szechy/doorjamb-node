angular.module('LogCtrl', []).controller('LogController', function($scope, $http) {

	$scope.tagline = 'Welcome to Log Central.';	

	// hit the get route to fetch all nerds
	console.log('fetching logs');
	$http.get('/api/logs')
		.success(function(data) {
			$scope.logs = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	console.log('fetched logs');

});