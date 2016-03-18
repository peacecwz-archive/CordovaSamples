var app = angular.module('LoginRegisterApp', ['ngRoute']);

var service = new WindowsAzure.MobileServiceClient('https://<api-name>.azurewebsites.net');

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/homepage.html',
            controller: 'HomePageController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomePageController', ['$location', '$scope', function ($location, $scope) {
    var id = localStorage.getItem('userid');
    if (id == null) {
        $location.url('/login');
    }
    else {
        var table = service.getTable('users');
        table.where({ id: id }).read().then(function (data) {
            if (data.length == 1) {
                var user = data[0];
                $scope.username = user.username;
            }
            else {
                $location.url('/login');
            }
        });
    }
}]);

app.controller('LoginController', ['$location', '$scope', function ($location, $scope) {
    $scope.Login = function (user) {
        var table = service.getTable('users');
        table.where({
            username: user.username,
            password: user.password
        }).read().then(function (data) {
            if (data.length == 0) {
                navigator.notification.alert('Böyle bir kullanıcı bulunmamaktadır.');
            }
            else {
                var user = data[0];
                localStorage.setItem('userid', user.id);
                
                $location.url('/');
            }
        });
    };
}]);

app.controller('RegisterController', ['$location', '$scope', function ($location, $scope) {
    $scope.Register = function (user) {
        var table = service.getTable('users');
        table.insert(user).then(function (result) {
            navigator.notification.alert('Başarılı bir şekilde üye oldunuz.');
            $location.url('/login');
        }, function (err) {
            navigator.notification.alert('Üye olurken hata oluştu.');
        });
    };
}]);