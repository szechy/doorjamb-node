angular.module('NerdCtrl', []).controller('NerdController', function($scope) {

	$scope.tagline = 'Nothing beats a pocket protector!';

	// when landing on the page, retrieve all nerds
	console.log('here');
	$http.get('/api/persons')
		.success(function(data) {
			$scope.persons = data;
			console.log(data);
		})
		.error(function(data) {
			$scope.error_report = data;
			console.log('Error: ' + data);
		});

});