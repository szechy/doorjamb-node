angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/profile', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/profile/persons', {
			templateUrl: 'views/person.html',
			controller: 'PersonController'
		})

		.when('/profile/logs', {
			templateUrl: 'views/log.html',
			controller: 'LogController'
		})

		.when('/profile/status', {
			templateUrl: 'views/status.html',
			controller: 'StatusController'
		})

		.when('/profile/doors', {
			templateUrl: 'views/door.html',
			controller: 'DoorController'
		})

	$locationProvider.html5Mode(true);

}]);