/* global angular */
/* global CryptoJS */

var myApp = angular.module('cryptextApp',['ngRoute']);

myApp.config(function($routeProvider) {
  $routeProvider
    .when('/aes', {
      templateUrl : 'templates/aes.html',
      controller  : 'AESController'
    })
    .when('/hash', {
      templateUrl : 'templates/hash.html',
      controller  : 'HashController'
    })
    .otherwise({
      redirectTo: '/aes'
    })
});

myApp.controller('HashController', ['$scope', function($scope) {
  $scope.methods = ["MD5", "SHA1", "SHA256", "RIPEMD160"];

  $scope.$watch('input', function(n,o) {
    if (n == null || n == '') {
      $scope.hashes = null;
    } else {
      $scope.hashes = {};
    }
    angular.forEach($scope.methods, function(method) {
      $scope.hashes[method] = CryptoJS[method](n).toString(CryptoJS.enc.Hex);
    });
  });
}]);

myApp.controller('AESController', ['$scope', function($scope) {
  var base64Matcher = new RegExp("^U2FsdGVkX1");

  $scope.io = '';
  $scope.passphrase = '';
  $scope.showPassphrase = false;
  $scope.plaintext = true;

  $scope.$watch('io', function() {
    $scope.plaintext = !base64Matcher.test($scope.io);
  });

  $scope.processForm = function() {
    if ($scope.plaintext) {
      // Encrypt
      $scope.io = CryptoJS.AES.encrypt($scope.io, $scope.passphrase).toString();
    } else {
      // Decrypt
      $scope.io = CryptoJS.AES.decrypt($scope.io, $scope.passphrase).toString(CryptoJS.enc.Utf8);
    }
  };

  $scope.toggleShowPassphrase = function($event){
    $scope.showPassphrase = !$scope.showPassphrase;
  };

  $scope.passphraseInputType = function() {
    return $scope.showPassphrase ? 'text' : 'password';
  };
  
  $scope.clear = function() {
    $scope.io = '';
    $scope.passphrase = '';
  };
  
  $scope.formEmpty = function() {
    return ($scope.io === '' && $scope.passphrase === '');
  };
}]);

myApp.directive('ngReallyClick', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        var message = attrs.ngReallyMessage;
        if (message && confirm(message)) {
          scope.$apply(attrs.ngReallyClick);
        }
      });
    }
  }
}]); 