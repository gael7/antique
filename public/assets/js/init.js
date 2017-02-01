var init={
  navbar: function(){
    $("#beforeLogin").append("<li class='dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>Views<span class='caret'></span></a><ul class='dropdown-menu' role='menu'><li><a href='/management'>Management</a></li><li><a href='/kitchen'>Kitchen</a></li><li><a href='/register'>Register</a></li></ul></li>");
  },
};

$(document).ready(function(){
init.navbar();
});
