angular.module('LogCtrl', []).controller('LogController', function($scope, $http) {

	$scope.tagline = 'Welcome to Log Central.';	

	// hit the get route to fetch all nerds
	console.log('fetching logs');
	$http.get('/api/logs')
		.success(function(data) {
			$scope.logs = data;
			/*$scope.persons = "".split.call(Array($scope.logs.length), ",");
			console.log('fetched logs');
			for(i = 0; i < $scope.logs.length; i++) {
				console.log(i);
				$http.get('/api/person/' + $scope.logs[i].person)
					.success(function(data) {
						console.log(data.first_name + ' ' + data.last_name);
						$scope.logs[i].actual_name = String(data.first_name + ' ' + data.last_name);
						console.log($scope.logs[i].actual_name);
						//$scope.persons[i] = data.first_name + ' ' + data.last_name;
					})
					.error(function(data) {
						console.log('Error: ' + data);
					});
			}*/
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
});