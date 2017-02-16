var app = angular.module('call_of_review_app', []);

app.controller('mainController', ['$http', function($http) {

  // this.url = "http://localhost:3000"
  this.userPass = {};
  this.users = {};
  this.user = {};
  this.games = [];
  this.game = [];
  this.formdata = {};
  this.editformdata = {};
  this.gameone = [];

//-------------------------toggle functionality btw local/heroku---------------

  var localEnv = false; // true/localhost, false/heroku

  if (localEnv) { var url = 'http://localhost:3000'} else { var url = 'https://call-of-review-frontend.herokuapp.com/' }


//----------------------login functionality------------------------------------------------------------------------------------
  this.hideLog = function() {
    document.getElementById("log").style.display="none";
  }

  this.showLog = function() {
    document.getElementById("log").style.display="block";
  }

  this.login = function(userPass) {
    console.log(userPass);

  $http({
    method: 'POST',
    url: url + '/users/login',
    data: { user: {
      username: userPass.username,
      password: userPass.password
    }}
  }).then(function(response) {
    console.log(this);
    this.user = response.data.user
    localStorage.setItem('token', JSON.stringify(response.data.token))

    console.log(response);
    this.showGames(this.user.id);
    this.hideLog();
    this.showOut();
  }.bind(this));// end login request
};// end login function

  //------------------------signup functionality-------------------------------------------------------------------------------
  this.hideSin = function() {
    document.getElementById("sin").style.display="none";
  }

  this.showSin = function() {
    document.getElementById("sin").style.display="block";
  }

  this.signup = function(userPass) {

  $http({
    method: 'POST',
    url: url + '/users',
    data: { user: {
      username: userPass.username,
      password: userPass.password
    }}
  }).then(function(response) {
    console.log(response);
    this.hideSin();
    this.showNew();
    this.login()
    this.showOut();
  }.bind(this));
  };// end signup function

//--------------------logout functionality---------------------------------------------------------------------------------------
  this.showOut = function() {
    document.getElementById("out").style.display="block";
  }

  this.logout = function() {
    localStorage.clear('token');
    location.reload();
  };// end logout function

//--------------------GET users---------------------------------------------------------------------------------------------------

this.getUsers = function() {
  console.log('get users function');
  $http({
    url: url + '/users',
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
      url: url + '/users/' + self.user.id + '/games',
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
      url: url + '/users/' + self.user.id + '/games/' + gameId,
      method: 'GET',
    }).then(function(response) {
      console.log("single game from server: ", response);
      self.game = response.data;
      scroll();
    })
  };// end showGame function

//------------------------create game--------------------------------------------------------------------------------------------

  scrollToNew = function() {
    window.scrollTo(200, 400);
  };

  this.showNew = function() {
    document.getElementById("new").style.display="block";
    scrollToNew();
  }

  this.hideNew = function() {
    document.getElementById("new").style.display="none";
  }

  this.createGames = function() {
    // var self = this;
    console.log('createGames function..');
    console.log('Formdata:', this.formdata);

    $http({
      method: 'POST',
      url: url + '/users/' + this.user.id + '/games/',
      data: this.formdata,
    }).then(function(result) {
      console.log(this.formdata);
      console.log('data from server:', result);
      this.formdata = {};
      this.games.unshift(result.data);
      this.hideNew();

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
      url: url + '/users/' + self.user.id + '/games/' + gameId,
    }).then(function(response) {
      console.log(response);
      self.deleteGames(response.data);
      console.log(self.deleteGames);
    })
  };// end deleteGamesFromDB function


//------------------------edit game--------------------------------------------------------------------------------

  scroll = function() {
    window.scrollTo(200, 200);
  };

  this.hideEdit = function() {
    document.getElementById("edit").style.display="none";
  }


  this.showEdit = function(gameId) {

    var self = this;
    $http({
      url: url + '/users/' + self.user.id + '/games/' + gameId,
      method: 'GET',
    }).then(function(response) {
      console.log("single game from server to edit: ", response);
      self.game = response.data;
    }).then(function(response){
      document.getElementById("edit").style.display="block";
      scroll();
    });

    this.editGame = function(gameId) {
      var self = this;
      console.log('editGames function..');
      console.log('Formdata:', self.game);
      console.log(gameId);

      $http({
        url: url + '/users/' + self.user.id + '/games/' + self.game.id,
        method: 'PUT',
        data: self.editformdata
      }).then(function(result) {
        console.log('data from server: ', result);
        self.editformdata = {};
        self.editGame.result;
        self.hideEdit();
        self.showGame(self.game.id);
      })
    };// end editGames function
  };// end showEdit function


//-------------------query games through API--------------------

  this.search = function(searchString, callback) {

    $resource({
      url: 'http://api.giantbomb.com/game/1/?api_key=52304d7c9dda9771814ff56149b186d55f0564ed&format=jsonp&json_callback=search',
      method: 'GET'
    }).then
  }

}]);// end controller
