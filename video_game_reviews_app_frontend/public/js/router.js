(function(){
  angular
    .module('call_of_review_app', ['ui.router'])
    .config(AuthRouter);

  function AuthRouter($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise("/index");

    $stateProvider
    .state('index', {
      url: '/index',
      params: {
        user: null
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/partials/login.html',
    })
    .state('signup', {
      url: '/signup',
      templateUrl: '/partials/signup.html',
    })
  }
})
