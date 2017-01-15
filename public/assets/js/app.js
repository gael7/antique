var register={
  categories:["drinks", "bakery", "pastry", "brunch"],
  total: 0,
  displayCategories: function(){
    $("#registerProducts").html("");
    for (var i = 0; i < register.categories.length; i++) {
      // Display the apropos information on the page
        $("#registerProducts").append("<div class='row'><a href='#' class='btn btn-info col-lg-12' id='categories' data-id='"+register.categories[i]+"'>"+register.categories[i]+"</a></div><br>");
  }
},
  getProducts: function(category){
    $("#registerProducts").html("");
    console.log(category);
    $.getJSON("/products/byCategory/"+ category, function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
          $("#registerProducts").append("<a href='#' class='btn btn-info col-lg-2' style='height:75px' id='product' data-id='"+data[i]._id+"'>"+data[i].productName+"<br>$"+data[i].productPrice+"</a>");
        }

      $("#registerProducts").append("<br><br><div class='row'><a href='#' class='btn btn-info col-lg-12' id='goBackRegister'>Go Back</a></div>");
    });
  },
  addToReceipt: function(product){
    $.getJSON("/products/"+ product, function(data) {
      $("#registerReceipt").append("<div class='row'><p class='col-lg-10'>"+data.productName+"</p><p class='col-lg-2'>$"+data.productPrice+"</p></div>");
      register.total=register.total+data.productPrice;
      $("#registerTotal").html("<div class='row'><p class='col-lg-10'>Total: </p><p class='col-lg-2'>$"+register.total+"</p></div>");
    });

  }
};

register.displayCategories();

$(document).on("click", "#goBackRegister", function() {
  register.displayCategories();
});

$(document).on("click", "#categories", function() {
  var thisId=$(this).attr("data-id");
  register.getProducts(thisId);
});

$(document).on("click", "#product", function() {
  var thisId=$(this).attr("data-id");
  register.addToReceipt(thisId);
});

$(document).on("click", "#addProduct", function() {
  console.log("name:" + $("#productName").val());
  console.log("price:" + $("#productPrice").val());
  console.log("category:" + $("#productCategory").val());
  $.ajax({
    method: "POST",
    url: "/addProduct",
    data: {
      // Value taken from name input
      productName: $("#productName").val(),
      // Value taken from price input
      productPrice: $("#productPrice").val(),
      // Value taken from category input
      productCategory: $("#productCategory").val(),
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
    });
  $("#productName").val("");
  $("#productPrice").val("");
});
