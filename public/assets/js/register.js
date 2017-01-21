var register={
  categories:["drinks", "bakery", "pastry", "brunch"],
  total: 0,
  receipt:[],
  customerName: "",
  receiptInfo: {},
  tableAccount: 0,
  receiptID: "",

  displayCategories: function(){
    $("#registerProducts").html("");
    for (var i = 0; i < register.categories.length; i++) {
      // Display the apropos information on the page
        $("#registerProducts").append("<div class='row'><a href='#' class='btn btn-info col-lg-12' id='categories' data-id='"+register.categories[i]+"'>"+register.categories[i]+"</a></div><br>");
  }
},

  displayTotal: function(){
    $("#registerTotal").html("<div class='row'><p class='col-lg-10'>Total: </p><p class='col-lg-2'>$"+register.total+"</p></div>");
  },

  getProducts: function(category){
    $("#registerProducts").html("");
    console.log(category);
    $.getJSON("/products/byCategory/"+ category, function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
          $("#registerProducts").append("<div class='col-lg-4'><a href='#' class='btn btn-info col-lg-10' style='height:75px' id='product' data-id='"+data[i]._id+"'>"+data[i].productName+"<br>$"+data[i].productPrice+"</a></div>");
        }
      $("#registerProducts").append("<br><br><div class='row'><a href='#' class='btn btn-info col-lg-12' id='goBackRegister'>Go Back</a></div>");
    });
  },

  addToReceipt: function(product){
    $.getJSON("/products/"+ product, function(data) {
      $("#registerReceipt").append("<div class='row receiptRow' data-id='"+data._id+"' data-price='"+data.productPrice+"'><p class='col-lg-8'>"+data.productName+"</p><p class='col-lg-2 quantityProduct' data-quantity='1' data-id='"+data._id+"'>x 1</p><p class='col-lg-2 productPrice' data-id='"+data._id+"'>$"+data.productPrice+"<button type='button' class='close' id='removeProduct' data-id='"+data._id+"'>&times;</button></p></div>");
      register.total=register.total+data.productPrice;
      register.displayTotal();
      register.receipt.push(product);
    });
    console.log(register.receipt);
  },

  duplicateProduct: function(product, isFromReceipt){
    var duplicateProductPrice=$(".receiptRow").filter("[data-id='"+product+"']").attr("data-price");
    var quantityProduct=$(".quantityProduct").filter("[data-id='"+product+"']").attr("data-quantity");
    var newQuantityProduct=parseInt(quantityProduct)+1;
    var newProductPrice=(parseInt(duplicateProductPrice))/(parseInt(quantityProduct))*newQuantityProduct;
    $(".receiptRow").filter("[data-id='"+product+"']").attr("data-price", newProductPrice);
    $(".quantityProduct").filter("[data-id='"+product+"']").attr("data-quantity", newQuantityProduct);
    $(".productPrice").filter("[data-id='"+product+"']").html("$"+newProductPrice+"<button type='button' class='close' id='removeProduct' data-id='"+product+"'>&times;</button>");
    $(".quantityProduct").filter("[data-id='"+product+"']").html("x "+newQuantityProduct);
    if(isFromReceipt!==true){
      console.log("Is not from receipt");
    register.total=register.total+(duplicateProductPrice/quantityProduct);
    register.receipt.push(product);
    register.displayTotal();
    }
  },

  createReceipt: function(table, customerName){
    //console.log("createReceipt function: "+register.receipt);
    $("#registerCustomer").html("");
    register.receiptInfo={
      customerName: register.customerName,
      activeTable: table,
      totalToPay: register.total,
      productsSell: JSON.stringify(register.receipt),
    };
    if(register.total!==0 && register.receipt!==[]){
    console.log(register.receiptInfo);
    $.ajax({method: "POST",
      url: "/createReceipt",
      data: register.receiptInfo,
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
      });
      register.total=0;
      register.receipt=[];
      register.receiptInfo={};
      register.customerName="";
      $("#registerReceipt").html("");
      $("#registerTotal").html("");
      $("#activeTables").html("");
      register.displayActiveTables();
    } else {
      console.log("No creating receipt");
    }
  },

  updateReceipt: function(table){
    console.log("update receipt function");
    register.receiptInfo={
      activeTable: table,
      totalToPay: register.total,
      productsSell: JSON.stringify(register.receipt)
    };
    $.ajax({method: "POST",
    url: "/updateReceipt/"+register.receiptID,
    data: register.receiptInfo,
  }).done(function(data){
    console.log(data);
  });
    register.total=0;
    register.receipt=[];
    receiptInfo={};
    register.tableAccount=0;
    $("#registerReceipt").html("");
    $("#registerTotal").html("");
    $("#activeTables").html("");
    $("#updateReceipt").addClass("disabled");
    register.displayActiveTables();
  },

  customerTable: function(){
    $("#registerCustomer").append("<label for='customerName' class='col-lg-2 control-label'>Name</label><div class='col-lg-6'><input type='text' class='form-control' id='customerName'></div><a href='#' class='btn btn-info col-lg-2' id='openTable'>Create</a>");
  },

  displayActiveTables: function(){
    $.getJSON("/receipts/activeTables", function(data) {
      $("#registerView").append("<div class='row' id='activeTables'></div>");
      for (i=0; i<data.length; i++){
      $("#activeTables").append("<div class='col-lg-2'><a href='#' class='btn btn-info col-lg-12' id='tableButtons' data-id='"+data[i]._id+"'>"+data[i].customerName+"<br>$"+data[i].totalToPay+"</a></div>");
    }
    });
  },

  getReceipt: function(receipt){
    register.total=0;
    register.receipt=[];
    register.receiptInfo={};
    register.tableAccount=1;
    register.receiptID=receipt;
    $("#registerReceipt").html("");
    $("#registerTotal").html("");
    $.getJSON("receipts/activeTables/"+receipt, function(data){
      $("#registerReceipt").append("<div class='row'>"+data.customerName+"</div>");
      for(i=0; i<data.productsSell.length; i++){
          if(jQuery.inArray(data.productsSell[i]._id, register.receipt) === -1){
            $("#registerReceipt").append("<div class='row receiptRow' data-id='"+data.productsSell[i]._id+"' data-price='"+data.productsSell[i].productPrice+"'><p class='col-lg-8'>"+data.productsSell[i].productName+"</p><p class='col-lg-2 quantityProduct' data-quantity='1' data-id='"+data.productsSell[i]._id+"'>x 1</p><p class='col-lg-2 productPrice' data-id='"+data.productsSell[i]._id+"'>$"+data.productsSell[i].productPrice+"<button type='button' class='close' id='removeProduct' data-id='"+data.productsSell[i]._id+"'>&times;</button></p></div>");
          } else {
            console.log("duplicate");
            register.duplicateProduct(data.productsSell[i]._id, true);
          }
          register.receipt.push(data.productsSell[i]._id);
        }

      register.total=data.totalToPay;
      register.displayTotal();
    });
    $("#updateReceipt").removeClass("disabled");
  }
};

$(document).on("ready", function(){
  register.displayCategories();
  register.displayActiveTables();
});

$(document).on("click", "#readyToPay", function() {
  console.log("ready to pay");
  var usingTable=false;
  if (register.tableAccount===0){
  register.createReceipt(usingTable);
} else if (register.tableAccount===1){
  register.updateReceipt(usingTable);
}
});

$(document).on("click", "#updateReceipt", function(){
  var usingTable=true;
  console.log("clicking to update receipt");
  register.updateReceipt(usingTable);
});

$(document).on("click", "#createTable", function() {
  var usingTable=true;
  if (register.tableAccount===0){
    console.log("Asking for name");
    register.customerTable();
    $(document).on("click", "#openTable", function(){
      console.log("opening table with name");
      register.customerName=$("#customerName").val();
      register.createReceipt(usingTable);
    });
  } else if (register.tableAccount===1){
    console.log("trying to update receipt");
  }
});

$(document).on("click", "#goBackRegister", function() {
  register.displayCategories();
});

$(document).on("click", "#categories", function() {
  var thisId=$(this).attr("data-id");
  register.getProducts(thisId);
});

$(document).on("click", "#removeProduct", function() {
  console.log("remove product press");
  var thisId=$(this).attr("data-id");
  var minusTotal=$(".receiptRow").filter("[data-id='"+thisId+"']").attr("data-price");
  $(".receiptRow").filter("[data-id='"+thisId+"']").remove();
  console.log("minus" + minusTotal);
  register.total=register.total-minusTotal;
  register.displayTotal();
  for(i=0; i<register.receipt.length; i++){
    if (register.receipt[i]===thisId){
      register.receipt.splice(i, 1);
      console.log(register.receipt);
      break;
    }
  }
});

$(document).on("click", "#tableButtons", function() {
  var thisId=$(this).attr("data-id");
  register.getReceipt(thisId);
});

$(document).on("click", "#product", function() {
  var thisId=$(this).attr("data-id");
  if(jQuery.inArray(thisId, register.receipt) === -1){
    console.log("not in the array");
    register.addToReceipt(thisId);
  } else {
    console.log("duplicate");
    register.duplicateProduct(thisId, false);
  }
});
