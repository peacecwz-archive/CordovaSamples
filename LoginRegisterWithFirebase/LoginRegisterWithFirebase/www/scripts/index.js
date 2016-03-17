var app = angular.module('LoginRegisterApp', ['ngRoute']);
var db = new Firebase("https://peacecwzsampleapp.firebaseio.com");

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
    var auth = db.getAuth();
    if (auth == null) {
        $location.url('/login');
    }
    else {
        $scope.email = auth.password.email;
        $scope.image = auth.password.profileImageURL.replace('"', '');
    }
}]);

app.controller('LoginController', ['$location', '$scope', function ($location, $scope) {
    if (db.getAuth() != null) $location.url('/');
    $scope.Login = function (user) {
        db.authWithPassword({
            email: user.email,
            password: user.password
        }, function (err, authData) {
            if (err) {
                navigator.notification.alert('Giriş yaparken bir hata oluştu.');
            } else {
                navigator.notification.alert('Başarılı Giriş yaptınız');
                $location.url('/');
            }
        }, { remember: 'sessionOnly' });
    }
}]);

app.controller('RegisterController', ['$location', '$scope', function ($location, $scope) {
    if (db.getAuth() != null) $location.url('/');
    $scope.Register = function (user) {
        db.createUser({
            email: user.email,
            password: user.password
        }, function (err) {
            if (err) {
                navigator.notification.alert('Üye olurken hata oluştu.');
            } else {
                navigator.notification.alert('Üyelik başarıyla oluşturulmuştur.');
                $location.url('/login');
            }
        });
    }
}]);