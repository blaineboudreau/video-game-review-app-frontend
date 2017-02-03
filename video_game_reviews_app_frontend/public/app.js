var app = angular.module('call_of_review_app', []);

app.controller('mainController', ['$http', function($http) {

  this.url = "http://localhost:3000"
  this.userPass = {};
  this.users = {};
  this.user = {};

  this.login = function(userPass) {
    console.log(userPass);

  $http({
    method: 'POST',
    url: this.url + '/users/login',
    data: { user: {
      username: userPass.username,
      password: userPass.password
    }}
  }).then(function(response) {
    console.log(this);
    this.user = response.data.user
    localStorage.setItem('token', JSON.stringify(response.data.token))

    console.log(response);
  }.bind(this));

}// end login

this.getUsers = function() {
  console.log('get users function');
  $http({
    url: this.url + '/users',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    }
  }).then(function(response) {
    console.log(response);
    if (response.data.status == 401) {
        this.error = "Unauthorized";
    } else {
      this.users = response.data;
    }
  }.bind(this));
} //end getUsers function


  this.logout = function() {
    localStorage.clear('token');
    location.reload();
  }// end logout function

}])// end controller

//clean up code on lines below and place in controller

// var localEnv = true; //change to true if using localhost, change to false if on heroku
// if (localEnv) { var urlString = 'http://localhost:3000'} else { var urlString = 'https://secure-crag-65287.herokuapp.com' }




// sign up straight through login
// users login route go to they're own page, users/1
// when users login hide the login option ng-ifs and vise versa for logout
