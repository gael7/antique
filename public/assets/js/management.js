var management={
  displayTableProducts: function(){
    $("#productsTable").html("");
    $.getJSON("/products", function(data) {
      console.log(data);
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
          $("#productsTable").append("<tr><td>"+i+"</td><td>"+data[i].productName+"</td><td>"+data[i].productPrice+"</td><td>"+data[i].productCategory+"</td><td><a href='#' class='btn btn-primary' id='updateProduct' data-id='"+data[i]._id+"' data-target='#updateProductModal' data-toggle='modal'>Update</a></td><td><button type='button' class='close' id='deleteProduct' data-id='"+data[i]._id+"'>&times;</button></td></tr>");
        }
    });
  },

  displayTableReceipts: function(){
    $("#receiptsTable").html("");
    $.getJSON("/receipts", function(data) {
      console.log(data);
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
          data[i].date=data[i].date.split("T");
          data[i].date[1]=data[i].date[1].split(".");
          $("#receiptsTable").append("<tr><td>"+i+"</td><td>"+data[i].customerName+"</td><td>"+data[i].totalToPay+"</td><td>"+data[i].date[0]+"</td><td>"+data[i].date[1][0]+"</td><td><button type='button' class='close' id='deleteReceipt' data-id='"+data[i]._id+"'>&times;</button></td></tr>");
        }
    });
  },

  modalUpdateProduct: function(product){
    $(".modal-header").html("");
    $(".modal-body").html("");
    $(".modal-footer").html("");
    $(".modal-header").append("<a type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</a>");
    $(".modal-header").append("<h4 class='modal-title'>Update Product</h4>");
    $(".modal-body").append("<div class='row'><div class='col-lg-12' id='modalBodyProduct'></div></div>");
    $("#modalBodyProduct").append("<div class='row'><label for='productNameUpdate' class='col-lg-2 control-label'>Name</label><div class='col-lg-6'><input id='productNameUpdate' class='form-control' type='text'></div></div>");
    $("#modalBodyProduct").append("<div class='row'><label for='productPriceUpdate' class='col-lg-2 control-label'>Price</label><div class='col-lg-6'><input id='productPriceUpdate' class='form-control' type='integer'></div></div>");
    $("#modalBodyProduct").append("<div class='row'><label for='productCategoryUpdate' class='col-lg-2 control-label'>Category</label><div class='col-lg-6'><select id='productCategoryUpdate' class='form-control'><option>drinks</option><option>bakery</option><option>pastry</option><option>brunch</option></select></div></div>");
    $(".modal-footer").append("<a href='#' class='btn btn-primary col-lg-4' id='updateProductDb' data-id='"+product+"'>Update</a>");
    $.getJSON("/products/"+product, function(data){
      console.log(data);
      $("#productNameUpdate").val(data.productName);
      $("#productPriceUpdate").val(data.productPrice);
      $("#productCategoryUpdate").val(data.productCategory);
    });
  }
};

$(document).ready(function(){
  management.displayTableProducts();
  management.displayTableReceipts();
});


$(document).on("click", "#addProduct", function() {
  $.ajax({
    method: "POST",
    url: "/addProduct",
    data: {
      // Value taken from name input
      productName: $("#productName").val().trim(),
      // Value taken from price input
      productPrice: $("#productPrice").val().trim(),
      // Value taken from category input
      productCategory: $("#productCategory").val().trim(),
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
    });
    management.displayTableProducts();
  $("#productName").val("");
  $("#productPrice").val("");
});

$(document).on("click", "#updateProduct", function(){
  var thisId=$(this).attr("data-id");
  management.modalUpdateProduct(thisId);
});

$(document).on("click", "#updateProductDb", function(){
  var thisId=$(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/updateProduct/"+thisId,
    data: {
      // Value taken from name input
      productName: $("#productNameUpdate").val().trim(),
      // Value taken from price input
      productPrice: $("#productPriceUpdate").val().trim(),
      // Value taken from category input
      productCategory: $("#productCategoryUpdate").val().trim(),
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
    });
    $(".modal-header").html();
    $(".modal-body").html();
    $(".modal-footer").html();
    $("#updateProductModal").modal("hide");
    $("#productNameUpdate").val("");
    $("#productPriceUpdate").val("");
  management.displayTableProducts();
});

$(document).on("click", "#deleteProduct", function(){
  console.log("deleting product");
  var thisId=$(this).attr("data-id");
  $.ajax({method: "DELETE", url: "deleteProduct/"+thisId});
  management.displayTableProducts();
});

$(document).on("click", "#deleteReceipt", function(){
  console.log("Is button working?");
  var thisId=$(this).attr("data-id");
  $.ajax({method: "DELETE", url: "deleteReceipt/"+thisId});
  management.displayTableReceipts();
});

$(document).on("click", "#deleteReceipts", function(){
  console.log("Deleting receipts");
  $.ajax({method: "DELETE", url: "deleteReceipts/"});
  management.displayTableReceipts();
});
