var registration={
  register: function(){
    var username=$("#usernameInput").val();
    var password=$("#passwordInput").val();
    var password2=$("#password2Input").val();
    var isAdm=$("#isAdmInput").is(":checked");
    if (password===password2){
      $.ajax({
        method: "POST",
        url: "/registration",
        data: {
          username: username,
          password: password,
          isAdm: isAdm
        }
      })
      .done(function(data){
                    if (typeof(data.redirect) == 'string'){
                        window.location = data.redirect;
                      }
      });
    } else {
      console.log("Password doesn't match");
    }
  }
};

$(document).on("click", "#registrationButton", function(){
  registration.register();
});
