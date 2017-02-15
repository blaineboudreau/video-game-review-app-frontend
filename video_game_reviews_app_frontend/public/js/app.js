var app = angular.module('call_of_review_app', []);

app.controller('mainController', ['$http', function($http) {

  this.url = "http://localhost:3000"
  this.userPass = {};
  this.users = {};
  this.user = {};
  this.games = [];
  this.game = [];
  this.formdata = {};
  this.editformdata = {};

//-------------------------toggle functionality btw local/heroku---------------

  // var localEnv = true; //change to true if using localhost, change to false if on heroku
  // if (localEnv) { var url = 'http://localhost:3000'} else { var url = 'https://call-of-review-frontend.herokuapp.com/' }


//----------------------login functionality------------------------------------------------------------------------------------

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
};// end login function

  //------------------------signup functionality-------------------------------------------------------------------------------

  this.signup = function(userPass) {

  $http({
    method: 'POST',
    url: this.url + '/users',
    data: { user: {
      username: userPass.username,
      password: userPass.password
    }}
  }).then(function(response) {
    console.log(response);
  }.bind(this));
  };// end signup function

//--------------------logout functionality---------------------------------------------------------------------------------------

  this.logout = function() {
    localStorage.clear('token');
    location.reload();
  };// end logout function

//--------------------GET users---------------------------------------------------------------------------------------------------

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

//-------------------------------show games by user index---------------------------------------------------------------------------------

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

// --------------------------show indivdual game-----------------------------------------------------------------------------------

  this.showGame = function(gameId) {
    var self = this;
    $http({
      url: this.url + '/users/' + self.user.id + '/games/' + gameId,
      method: 'GET',
    }).then(function(response) {
      console.log("single game from server: ", response);
      self.game = response.data;
    })
  };// end showGame function

//------------------------create game--------------------------------------------------------------------------------------------

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

//------------------------------delete game-------------------------------------------------------------------------


  this.deleteGames = function(games) {
    for (i = 0; i < this.games.length; i++) {
      if( this.games[i].id === games.id) {
      this.games.splice(i,1);
    }
  }
}// end of deleteGames function


  this.deleteGamesFromDB = function(gameId) {
    console.log(gameId);
    var self = this;
    $http({
      method: 'DELETE',
      url: this.url + '/users/' + self.user.id + '/games/' + gameId,
    }).then(function(response) {
      console.log(response);
      self.deleteGames(response.data);
      console.log(self.deleteGames);
    })
  };// end deleteGamesFromDB function


//------------------------edit game--------------------------------------------------------------------------------

  this.editGame = function(gameId) {
    var self = this;
    console.log('editGames function..');
    console.log('Formdata:', self.editformdata);
    console.log(gameId);

    $http({
      url: this.url + '/users/' + self.user.id + '/games/' + gameId,
      method: 'PUT',
      data: self.editformdata
    }).then(function(result) {
      console.log('data from server: ', result);
      self.editformdata = {};
      self.editGame.result;
    })
  };// end editGames function

//-------------------query games through API--------------------

  this.search = function(searchString, callback) {

    $resource({
      url: 'http://api.giantbomb.com/game/1/?api_key=52304d7c9dda9771814ff56149b186d55f0564ed&format=jsonp&json_callback=search',
      method: 'GET'
    }).then
  }

}]);// end controller

//----------------------------javascript--------------------------------------

// window.onload=function() {
//
//   document.getElementById("new").style.display="none";
//   document.getElementById("sin").style.display="none";
//   document.getElementById("log").style.display="none";
// }
//
// show = function() {
//     document.getElementById("new").style.display="block";
// }
//
// showEdit = function() {
//     document.getElementById("edit").style.display="block";
// }
//
// showSin = function() {
//     document.getElementById("sin").style.display="block";
// }
//
// showLog = function() {
//     document.getElementById("log").style.display="block";
// }
