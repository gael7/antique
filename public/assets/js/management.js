var management={
  displayControlPanel: function(){
    $("#controlPanel").html("<div class='col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-2 col-sm-6 col-sm-offset-3 col-xs-12'><div class='panel panel-warning'><div class='panel-heading'><h3 class='panel-title'>Management Control</h3></div><div class='panel-body'><div class='col-lg-4' id='controlPanelAll'></div><div class='col-lg-8' id='controlPanelCategory'></div></div></div>");
    $("#controlPanelAll").append("<div class='row'><div class='col-lg-12'><div class='col-lg-10'><h4>Add Product</h4></div><div class='col-lg-2'><a href='#' class='btn btn-primary' id='addProductControl'>Go</a></div></div></div>");
    $("#controlPanelAll").append("<div class='row'><div class='col-lg-12'><div class='col-lg-10'><h4>View All Products</h4></div><div class='col-lg-2'><a href='#' class='btn btn-primary' id='allProductsControl'>Go</a></div></div></div>");
    $("#controlPanelAll").append("<div class='row'><div class='col-lg-12'><div class='col-lg-10'><h4>View All Receipts</h4></div><div class='col-lg-2'><a href='#' class='btn btn-primary' id='allReceiptsControl'>Go</a></div></div></div>");
    $("#controlPanelAll").append("<div class='row'><div class='col-lg-12'><div class='col-lg-10'><h4>Delete All Receipts</h4></div><div class='col-lg-2'><a href='#' class='btn btn-danger disabled' id='deleteReceipts'>Go</a></div></div></div>");
    $("#controlPanelCategory").append("<div class='row'><div class='col-lg-12'><div class='col-lg-6'><h4>Products by Category</h4></div><div class='col-lg-5'><select class='form-control' id='productCategory'><option>drinks</option><option>bakery</option><option>pastry</option><option>brunch</option></select></div><div class='col-lg-1'><a href='#' class='btn btn-primary' id='productsByCategoryControl'>Go</a></div></div></div>");
    $("#controlPanelCategory").append("<div class='row'><div class='col-lg-12'><div class='col-lg-6'><h4>Receipts by Date Range</h4></div><div class='col-lg-5'><input type='text' class='form-control' name='daterange'/></div><div class='col-lg-1'><a href='#' class='btn btn-primary' id='receiptsByDateControl'>Go</a></div></div></div>");
  },

  displayAddProduct: function(){
    $("#actionPanel").html("<div class='col-lg-6 col-md-6 col-sm-6 col-xs-12'><div class='panel panel-warning'><div class='panel-heading'><h3 class='panel-title'>Add Product</h3></div><div class='panel-body' id='addProductPanel'></div></div>");
    $("#addProductPanel").append("<div class='form-group'><div class='row'><label for='productName' class='col-lg-2 col-md-2 control-label'>Name</label><div class='col-lg-8 col-md-8'><input type='text' class='form-control' id='productName'></div></div><div class='row'><label for='productPrice' class='col-lg-2 col-md-2 control-label'>Price</label><div class='col-lg-8 col-md-8'><input type='integer' class='form-control' id='productPrice'></div></div><div class='row'><label for='productCategory' class='col-lg-2 col-md-2 control-label'>Category</label><div class='col-lg-8 col-md-8'><select class='form-control' id='productCategory'><option>drinks</option><option>bakery</option><option>pastry</option><option>brunch</option></select></div></div></div><a href='#' class='btn btn-primary col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-12' id='addProduct'>Add Product</a></div>");
  },

  displayTableProducts: function(){
    $("#actionPanel").html("<div class='row'><div class='col-lg-12'><table class='table table-striped table-hover'><thead><tr><th>#</th><th>Name</th><th>$ Price</th><th>Category</th><th>Update</th><th>Delete</th></tr></thead><tbody id='productsTable'></tbody></table></div></div>");
    $.getJSON("/products", function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
          $("#productsTable").append("<tr><td>"+i+"</td><td>"+data[i].productName+"</td><td>"+data[i].productPrice+"</td><td>"+data[i].productCategory+"</td><td><a href='#' class='btn btn-primary' id='updateProduct' data-id='"+data[i]._id+"' data-target='#updateProductModal' data-toggle='modal'>Update</a></td><td><button type='button' class='close' id='deleteProduct' data-id='"+data[i]._id+"'>&times;</button></td></tr>");
        }
    });
  },

  displayTableProductsByCategory: function(category){
    $("#actionPanel").html("<div class='row'><div class='col-lg-12'><table class='table table-striped table-hover'><thead><tr><th>#</th><th>Name</th><th>$ Price</th><th>Category</th><th>Update</th><th>Delete</th></tr></thead><tbody id='productsTable'></tbody></table></div></div>");
    $.getJSON("/products/byCategory/"+ category, function(data) {
      for (var i = 0; i < data.length; i++) {
          $("#productsTable").append("<tr><td>"+i+"</td><td>"+data[i].productName+"</td><td>"+data[i].productPrice+"</td><td>"+data[i].productCategory+"</td><td><a href='#' class='btn btn-primary' id='updateProduct' data-id='"+data[i]._id+"' data-target='#updateProductModal' data-toggle='modal'>Update</a></td><td><button type='button' class='close' id='deleteProduct' data-id='"+data[i]._id+"'>&times;</button></td></tr>");
        }
    });
  },

  displayTableReceipts: function(){
    $("#actionPanel").html("<div class='row'><div class='col-lg-12'><table class='table table-striped table-hover'><thead><tr><th>#</th><th>Name</th><th>$ Total</th><th>Date</th><th>Time</th><th>Delete</th></tr></thead><tbody id='receiptsTable'></tbody></table></div></div>");
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

  displayTableReceiptByDate: function(date, date1){
    $("#actionPanel").html("<div class='row'><div class='col-lg-12'><table class='table table-striped table-hover'><thead><tr><th>#</th><th>Name</th><th>$ Total</th><th>Date</th><th>Time</th><th>Delete</th></tr></thead><tbody id='receiptsTable'></tbody></table></div></div>");
    $.getJSON("/receipts/byDate/"+date+"/"+date1, function(data) {
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
  management.displayControlPanel();
  $('input[name="daterange"]').daterangepicker();
});

$(document).on("click", "#addProductControl", function(){
  management.displayAddProduct();
});

$(document).on("click", "#allProductsControl", function(){
  management.displayTableProducts();
});

$(document).on("click", "#allReceiptsControl", function(){
  management.displayTableReceipts();
});

$(document).on("click", "#productsByCategoryControl", function(){
  var category=$("#productCategory").val();
  management.displayTableProductsByCategory(category);
});

$(document).on("click", "#receiptsByDateControl", function(){
  var receiptsDate=$('input[name="daterange"]').val();
  console.log(receiptsDate);
  receiptsDate=receiptsDate.split("-");
  receiptsDate1=receiptsDate[0].split("/");
  receiptsDate2=receiptsDate[1].split("/");
  receiptsDate1=receiptsDate1[2].trim()+"-"+receiptsDate1[0]+"-"+receiptsDate1[1];
  receiptsDate2=receiptsDate2[2].trim()+"-"+receiptsDate2[0].trim()+"-"+receiptsDate2[1];
  console.log(receiptsDate1);
  console.log(receiptsDate2);
  management.displayTableReceiptByDate(receiptsDate1, receiptsDate2);
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
