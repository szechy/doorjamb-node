angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/persons', {
			templateUrl: 'views/person.html',
			controller: 'PersonController'
		})

		.when('/logs', {
			templateUrl: 'views/log.html',
			controller: 'LogController'
		})

		.when('/status', {
			templateUrl: 'views/status.html',
			controller: 'StatusController'
		})

		.when('/doors', {
			templateUrl: 'views/door.html',
			controller: 'DoorController'
		})

	$locationProvider.html5Mode(true);

}]);