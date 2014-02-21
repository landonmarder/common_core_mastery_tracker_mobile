$(function(){
  var appUser;

  var client = new Apigee.Client({
    orgName: 'landonmarder', // Your Apigee.com username for App Services
    appName: 'sixth-grade-math-core' // Your Apigee App Services app name
  });

  var standards = new Apigee.Collection({
    "client": client,
    "type": "standards",
    "qs": {
      "limit": 100,
      "ql": "order by title"
    }
  });

  client.getLoggedInUser(function(err, data, user) {
    if (err) {
      window.location = "#page-login"
    } else {
      if (client.isLoggedIn()) {
        appUser = user;
      }
    }
  });

  $('#form-add-user').on('click', '#btn-submit', createUser);
  $('#form-login-user').on('click', '#btn-submit', login);
  $('#header-mylist').on('click', '#btn-logout', function() {
    client.logout();
    $('#form-login-user #btn-submit').removeClass('hideaway');
  });

  function createUser() {
    var fullname = $("#form-new-fullname").val();
    var username = $("#form-new-username").val();
    var password = $("#form-new-password").val();
    var email = $("#form-new-email").val();
    client.signup(username, password, email, fullname, function(err, data) {
      if (err) {
        console.log('FAIL')
      } else {
        console.log('SUCCESS');
        login(username, password);
        $("#form-new-username").val('');
        $("#form-new-password").val('');
        $("#form-new-password").val('');
        $("#form-new-email").val('');
      }
    });
  }

  function login(username, password) {
    $('#login-section-error').html('');

    if (username && password) {
      var username = username;
      var password = password;
    } else {
      var username = $("#form-username").val();
      var password = $("#form-password").val();
    }

    client.login(username, password,
      function(err) {
        if (err) {
          $('#login-section-error').html('There was an error logging you in.');
          console.log(err)
        } else {
          //login succeeded
          client.getLoggedInUser(function(err, data, user) {
              if (err) {
                  //error - could not get logged in user
              } else {
                  if (client.isLoggedIn()) {
                      appUser = user;
                  }
              }
          });

          //clear out the login form so it is empty if the user chooses to log out
          $("#form-username").val('');
          $("#form-password").val('');

          window.location = "#page-main";
          // loadItems(myList);
        }
      }
    );
  }

  $('body').on('swipe', '.objective', function() {
    var standard = this.textContent;
    var result = parseFloat(prompt("What is your mastery for: "+ standard));
    var userId = appUser._data.uuid;
    if ((isNaN(result)) || (result < 0) || (result > 100)) {
      return alert("Sorry, you need to enter a number between 0 and 100");
    }

    var newItem = {
      'standard': standard,
      'result': result,
      'userID': userId
    }

    standards.addEntity(newItem, function(err, res){
      if (err) {
        alert('error');
      } else {
        alert('success');
      }
    });
  });

  $('body').on('click', '#btn-load-completed', function(){
    // var completedStandards = new Apigee.Collection({
    //   "client": client,
    //   "type": "standards",
    //   "qs": { "ql": ("where userID=" + appUser._data.uuid) }
    // });
    // debugger;

    var options = {
      "method": "GET",
      "endpoint": "standards",
      "qs": {"ql": ("where userID=" + appUser._data.uuid) }
    };

    client.request(options, function (err, data) {
      if (err) {
        console.log("FAIL");
      } else {
        debugger;
      }
    })
  });


});
