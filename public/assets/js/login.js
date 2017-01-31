$(document).on("click", "#loginButton", function(){
  console.log("Login attempt");
  var username=$("#usernameInput").val();
  var password=$("#passwordInput").val();

  $.ajax({
    method: "POST",
    url: "/login",
    data: {
      username: username,
      password: password,
    }
  })
  .done(function(data){
    console.log(data.token);
    localStorage.setItem('userToken', data.token);
                if (typeof(data.redirect) == 'string'){
                    window.location = data.redirect;
                  }
  });
});
