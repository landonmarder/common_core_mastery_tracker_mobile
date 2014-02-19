$(function(){
  var appUser;

  var client = new Apigee.Client({
    orgName: 'landonmarder', // Your Apigee.com username for App Services
    appName: 'sixth-grade-math-core' // Your Apigee App Services app name
  });

  var standards = new Apigee.Collection({
    "client": client,
    "type": "standards",
  })

  var myList = new Apigee.Collection({
    "client": client,
    "type": "users/me/mystandards"
  })

  client.getLoggedInUser(function(err, data, user) {
    if (err) {
      window.location = "#page-login"
    } else {
      if (client.isLoggedIn()) {
        appUser = user;
        // loadItems(myList);
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
          loadItems(myList);
        }
      }
    );
  }

  $('#form-add-item').on('click', '#btn-submit', function() {
            if ($('#form-title').val() !== '') {
                var newItem = {
                    'title': $('#form-title').val(),
                    'desc': $('#form-desc').val()
                }
                items.addEntity(newItem, function(error, response) {
                    if (error) {
                        alert("write failed");
                    } else {
                        var options = {
                            "type": "items",
                            "uuid": response._data.uuid
                        }
                        client.getEntity(options, function(error, response) {
                            appUser.connect("myitems", response, function(error, data) {
                                if (error) {
                                    alert("error!");
                                } else {
                                    $('#form-title').val('');
                                    $('#form-desc').val('');
                                    $('#btn-load-mylist').trigger('click');
                                    window.location = "#page-main";
                                }
                            });
                        });
                    }
                });
            }
        });

        $('form').on('click', '#btn-clear', function() {
            $('input').val('');
        });

        $('#bucketlist').on('click', 'a', function(e) {
            if ($('#bucketlist').hasClass('masterList')) {
                var options = {
                    "type": "items",
                    "uuid": $(this).attr('data-uuid')
                }
                client.getEntity(options, function(error, response) {
                    appUser.connect("myitems", response, function(error, data) {
                        if (error) {
                            alert("error!");
                        } else {
                            loadItems(myList);
                            $('.masterList').removeClass('masterList');
                        }
                    });
                });
                e.preventDefault();
            } else {
                var options = {
                    "type": "items",
                    "uuid": $(this).attr('data-uuid')
                };
                client.getEntity(options, function(error, response) {
                    var title = response.get('title');
                    var desc = response.get('desc');
                    var completedby = response.get('completedby');
                    $('#form-title').val(title);
                    $('#form-desc').val(desc);
                    $('#form-uuid').val(options.uuid);
                    $('#form-completedby').val(completedby);
                });
                $('#btn-submit, #btn-cancel').addClass('hideaway');
                $('#btn-did-it, #btn-forget-it').removeClass('hideaway');
            }
        });

});
