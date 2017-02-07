var app = angular.module('call_of_review_app', []);

app.controller('mainController', ['$http', function($http) {

  this.url = "http://localhost:3000"
  this.userPass = {};
  this.users = {};
  this.user = {};
  this.games = {};
  this.game = {};
  this.formdata = {};

//-------------------------toggle functionality btw local/heroku---------------

  // var localEnv = true; //change to true if using localhost, change to false if on heroku
  // if (localEnv) { var url = 'http://localhost:3000'} else { var url = 'https://call-of-review-frontend.herokuapp.com/' }

//----------------------login functionality------------------------------------

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
  }.bind(this));// end login request

  }// end login function

//--------------------logout functionality------------------------------------

  this.logout = function() {
    localStorage.clear('token');
    location.reload();
  }// end logout function

//--------------------GET users------------------------------------------------

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

//-------------------------------show games by user index------------------------------

  this.showGames = function(userId) {
    var self = this;
    $http({
      url: this.url + '/users/' + self.user.id + '/games',
      method: 'GET',
    }).then(function(response) {
      console.log(response);
      console.log(self.user);
      self.games = response.data;
      console.log(response);
    })
  };// end showGames function

// --------------------------show indivdual game--------------------------------

  this.showGame = function(userId) {
    var self = this;
    $http({
      url: this.url + '/users/' + self.user.id + '/games/' + self.game.id,
      method: 'GET',
    }).then(function(response) {
      console.log(response);
      self.game.id = response.data;
      console.log(response);
    })
  };// end showGame function

//------------------------create game-----------------------------------------

  this.createGames = function() {
    // var self = this;
    console.log('createGames function..');
    console.log('Formdata:', this.formdata);

    $http({
      method: 'POST',
      url: this.url + '/users/' + this.user.id + '/games/',
      data: this.formdata,
    }).then(function(result) {
      console.log(this.formdata);
      console.log('data from server:', result);
      this.formdata = {};
    }.bind(this));
  }// end createGames function

//------------------------------delete game----------------------


  this.deleteGames = function(games) {
    for (i = 0; i < this.games.length; i++) {
      if( this.games[i].id === games.id) {
      this.games.splice(i,1);
    }
  }
}// end of deleteGames function


  this.deleteGamesFromDB = function(games) {
    console.log(games);

    $http({
      method: 'DELETE',
      url: urlString + '/users/' + games.user_id + '/games/' + games.id,
    }).then(function(response) {
      console.log(response);
      this.deleteGames(response.data);
      console.log(this.deleteGames);
    }.bind(this));
  }// end deleteGamesFromDB function


//------------------------edit game-----------------------------






}]);// end controller




// sign up straight through login
// users login route go to they're own page, users/1
// when users login hide the login option ng-ifs and vise versa for logout
