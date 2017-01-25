var management={
  displayTableProducts: function(){
    $.getJSON("/products", function(data) {
      console.log(data);
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
          $("#productsTable").append("<tr><td>"+i+"</td><td>"+data[i].productName+"</td><td>"+data[i].productPrice+"</td><td>"+data[i].productCategory+"</td></tr>");
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
  }
};

management.displayTableProducts();
management.displayTableReceipts();

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
  $("#productName").val("");
  $("#productPrice").val("");
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
