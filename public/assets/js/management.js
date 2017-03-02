var management={
  receiptTotal: 0,
  displayControlPanel: function(){
    $("#controlPanel").html("<div class='col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12'><div class='panel panel-warning'><div class='panel-heading'><h3 class='panel-title'>Management Control</h3></div><div class='panel-body'><div class='col-lg-4 col-md-4 col-sm-5' id='controlPanelAll'></div><div class='col-lg-8 col-md-8 col-sm-7' id='controlPanelCategory'></div></div></div>");
    $("#controlPanelAll").append("<div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='col-lg-10 col-md-10 col-sm-10 col-xs-10'><h4>Add Product</h4></div><div class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><a href='#actionPanel' class='btn btn-primary' id='addProductControl'>Go</a></div></div></div>");
    $("#controlPanelAll").append("<div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='col-lg-10 col-md-10 col-sm-10 col-xs-10'><h4>View All Products</h4></div><div class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><a href='#actionPanel' class='btn btn-primary' id='allProductsControl'>Go</a></div></div></div>");
    $("#controlPanelAll").append("<div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='col-lg-10 col-md-10 col-sm-10 col-xs-10'><h4>View All Receipts</h4></div><div class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><a href='#actionPanel' class='btn btn-primary' id='allReceiptsControl'>Go</a></div></div></div>");
    $("#controlPanelAll").append("<div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='col-lg-10 col-md-10 col-sm-10 col-xs-10'><h4>Delete All Receipts</h4></div><div class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><a href='#actionPanel' class='btn btn-danger disabled' id='deleteReceipts'>Go</a></div></div></div>");
    $("#controlPanelCategory").append("<div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='col-lg-5 col-md-5 col-sm-12 col-xs-12'><h4>Products by Category</h4></div><div class='col-lg-5 col-md-5 col-sm-8 col-xs-10'><select class='form-control' id='productCategoryC'><option>drinks</option><option>bakery</option><option>pastry</option><option>brunch</option></select></div><div class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><a href='#actionPanel' class='btn btn-primary' id='productsByCategoryControl'>Go</a></div></div></div>");
    $("#controlPanelCategory").append("<div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='col-lg-5 col-md-5 col-sm-12 col-xs-12'><h4>Receipts by Date Range</h4></div><div class='col-lg-5 col-md-5 col-sm-8 col-xs-10'><input type='text' class='form-control' name='daterange'/></div><div class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><a href='#actionPanel' class='btn btn-primary' id='receiptsByDateControl'>Go</a></div></div></div>");
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
    management.receiptTotal=0;
    $("#actionPanel").html("<div class='row'><div class='col-lg-12'><table class='table table-striped table-hover'><thead><tr><th>#</th><th>Name</th><th>$ Total</th><th>Date</th><th>Time</th><th>Delete</th></tr></thead><tbody id='receiptsTable'></tbody></table></div></div>");
    $.getJSON("/receipts", function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        data[i].date=moment(data[i].date).tz('America/Regina').format();
        // Display the apropos information on the page
          data[i].date=data[i].date.split("T");
          data[i].date[1]=data[i].date[1].split(".");
          data[i].date[1]=data[i].date[1][0].split("-");
          if(data[i].customerName===undefined){
            data[i].customerName='';
          }
          $("#receiptsTable").append("<tr><td>"+i+"</td><td>"+data[i].customerName+"</td><td>"+data[i].totalToPay+"</td><td>"+data[i].date[0]+"</td><td>"+data[i].date[1][0]+"</td><td><button type='button' class='close' id='deleteReceipt' data-id='"+data[i]._id+"'>&times;</button></td></tr>");
          management.receiptTotal=management.receiptTotal+data[i].totalToPay;
        }
        $("#receiptsTable").append("<tr class='warning'><td>"+data.length+"</td><td>Total:</td><td>$"+management.receiptTotal+"</td><td></td><td></td><td></td><tr>");
    });
  },

  displayTableReceiptByDate: function(date, date1){
    management.receiptTotal=0;
    $("#actionPanel").html("<div class='row'><div class='col-lg-12'><table class='table table-striped table-hover'><thead><tr><th>#</th><th>Name</th><th>$ Total</th><th>Date</th><th>Time</th><th>Delete</th></tr></thead><tbody id='receiptsTable'></tbody></table></div></div>");
    $.getJSON("/receipts/byDate/"+date+"/"+date1, function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        data[i].date=moment(data[i].date).tz('America/Regina').format();
        // Display the apropos information on the page
          data[i].date=data[i].date.split("T");
          data[i].date[1]=data[i].date[1].split(".");
          data[i].date[1]=data[i].date[1][0].split("-");
          $("#receiptsTable").append("<tr><td>"+i+"</td><td>"+data[i].customerName+"</td><td>"+data[i].totalToPay+"</td><td>"+data[i].date[0]+"</td><td>"+data[i].date[1][0]+"</td><td><button type='button' class='close' id='deleteReceipt' data-id='"+data[i]._id+"'>&times;</button></td></tr>");
          management.receiptTotal=management.receiptTotal+data[i].totalToPay;
        }
        $("#receiptsTable").append("<tr class='warning'><td>"+data.length+"</td><td>Total:</td><td>$"+management.receiptTotal+"</td><td></td><td></td><td></td><tr>");
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
      $("#productNameUpdate").val(data.productName);
      $("#productPriceUpdate").val(data.productPrice);
      $("#productCategoryUpdate").val(data.productCategory);
    });
  }
};

$(document).ready(function(){
  management.displayControlPanel();
  $('input[name="daterange"]').daterangepicker();
  moment.tz.add("America/Regina|LMT MST MDT MWT MPT CST|6W.A 70 60 60 60 60|012121212121212121212121341212121212121212121212121215|-2AD51.o uHe1.o 1in0 s2L0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 66N0 1cL0 1cN0 19X0 1fB0 1cL0 1fB0 1cL0 1cN0 1cL0 M30 8x20 ix0 1ip0 1cL0 1ip0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 3NB0 1cL0 1cN0|19e4");
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
  var category=$("#productCategoryC").val();
  management.displayTableProductsByCategory(category);
});

$(document).on("click", "#receiptsByDateControl", function(){
  var receiptsDate=$('input[name="daterange"]').val();
  receiptsDate=receiptsDate.split("-");
  receiptsDate1=receiptsDate[0].split("/");
  receiptsDate2=receiptsDate[1].split("/");
  receiptsDate1=receiptsDate1[2].trim()+"-"+receiptsDate1[0]+"-"+receiptsDate1[1];
  receiptsDate2=receiptsDate2[2].trim()+"-"+receiptsDate2[0].trim()+"-"+receiptsDate2[1];
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
      productCategory: $("#productCategory").val(),
    }
  }).done(function(data) {
      management.displayTableProducts();
    });
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
  }).done(function(data) {
    management.displayTableProducts();
    });
    $(".modal-header").html();
    $(".modal-body").html();
    $(".modal-footer").html();
    $("#updateProductModal").modal("hide");
    $("#productNameUpdate").val("");
    $("#productPriceUpdate").val("");
});

$(document).on("click", "#deleteProduct", function(){
  var thisId=$(this).attr("data-id");
  $.ajax({method: "DELETE", url: "deleteProduct/"+thisId}).done(function(data){
      management.displayTableProducts();
  });
});

$(document).on("click", "#deleteReceipt", function(){
  var thisId=$(this).attr("data-id");
  $.ajax({method: "DELETE", url: "deleteReceipt/"+thisId}).done(function(data){
      management.displayTableReceipts();
  });
});

$(document).on("click", "#deleteReceipts", function(){
  $.ajax({method: "DELETE", url: "deleteReceipts/"}).done(function(data){
    management.displayTableReceipts();
  });
});
