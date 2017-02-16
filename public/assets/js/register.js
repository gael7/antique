var register={
  categories:[{
    name: "drinks",
    icon: "coffee.png"
  },{
    name: "bakery",
    icon: "bread.png"
  },{
    name: "pastry",
    icon: "cupcake.png"
  },{
    name: "brunch",
    icon: "restaurant.png"
  }],
  total: 0,
  receipt:[],
  customerName: "",
  receiptInfo: {},
  tableAccount: 0,
  receiptID: "",
  temporalTotal: 0,

  displayCategories: function(){
    $("#registerProducts").html("");
    for (var i = 0; i < register.categories.length; i++) {
      // Display the apropos information on the page
        $("#registerProducts").append("<div class='col-lg-3 col-md-3 col-sm-3 col-xs-6' style='padding-bottom:10px'><a href='#' class='btn  btn-squared-default-plain btn-primary' id='categories' data-id='"+register.categories[i].name+"'><img src='/assets/images/"+register.categories[i].icon+"'><br>"+register.categories[i].name+"</a></div>");
        }
  },

  displayTotal: function(){
    $("#registerTotal").html("<div class='row'><p class='col-lg-10 col-md-10 col-sm-10 col-xs-9'>Total: </p><p class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>$"+register.total+"</p></div>");
  },

  getProducts: function(category){
    $("#registerProducts").html("");
    console.log(category);
    $.getJSON("/products/byCategory/"+ category, function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
          $("#registerProducts").append("<div class='col-lg-4 col-md-4 col-sm-4 col-xs-6' style='padding-bottom:10px'><a href='#' class='btn btn-primary col-lg-12 col-md-12 col-sm-12 col-xs-12' style='height:75px' id='product' data-id='"+data[i]._id+"'>"+data[i].productName+"<br>$"+data[i].productPrice+"</a></div>");
        }
      $("#registerProducts").append("<br><br><div class='row'><a href='#' class='btn btn-primary col-lg-12 col-md-12 col-sm-12 col-xs-12' id='goBackRegister'>Go Back &emsp;<img src='/assets/images/arrow.png'></a></div>");
    });
  },

  addToReceipt: function(product){
    $.getJSON("/products/"+ product, function(data) {
      $("#registerReceipt").append("<div class='row receiptRow' data-id='"+data._id+"' data-price='"+data.productPrice+"'><p class='col-lg-8 col-md-8 col-sm-8 col-xs-7'>"+data.productName+"</p><p class='col-lg-2 col-md-2 col-sm-2 col-xs-2 quantityProduct' data-quantity='1' data-id='"+data._id+"'>x 1</p><p class='col-lg-2 col-md-2 col-sm-2 col-xs-3 productPrice' data-id='"+data._id+"'>$"+data.productPrice+"<button type='button' class='close' id='removeProduct' data-id='"+data._id+"'>&times;</button></p></div>");
      register.total=register.total+data.productPrice;
      register.displayTotal();
      register.receipt.push(product);
    });
    console.log(register.receipt);
    $("#createTable").removeClass("disabled");
    $("#readyToPay").removeClass("disabled");
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
    $("#createTable").addClass("disabled");
    $("#readyToPay").addClass("disabled");
  },

  updateReceipt: function(table){
    console.log("update receipt function");
    register.receiptInfo={
      activeTable: table,
      totalToPay: register.total,
      productsSell: JSON.stringify(register.receipt)
    };
    $.ajax({method: "PUT",
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
    $("#createTable").addClass("disabled");
    $("#readyToPay").addClass("disabled");
  },

  customerTable: function(){
    $("#registerCustomer").append("<label for='customerName' class='col-lg-2 control-label'>Name</label><div class='col-lg-6'><input type='text' class='form-control' id='customerName'></div><a href='#' class='btn btn-primary col-lg-2' id='openTable'>Create</a>");
  },

  displayActiveTables: function(){
    $.getJSON("/receipts/activeTables", function(data) {
      $("#registerView").append("<div class='row' id='activeTables'></div>");
      for (i=0; i<data.length; i++){
      $("#activeTables").append("<div class='col-lg-3 col-md-4 col-sm-4 col-xs-6' style='padding-bottom:10px'><a href='#' class='btn btn-primary col-lg-12 col-md-12 col-sm-12 col-xs-12' id='tableButtons' data-id='"+data[i]._id+"'>"+data[i].customerName+"<br>$"+data[i].totalToPay+"</a></div>");
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
      $("#registerReceipt").append("<div class='row'><div class='col-lg-12'><h3 class='text-center'>"+data.customerName+"</h3></div></div>");
      for(i=0; i<data.productsSell.length; i++){
          if(jQuery.inArray(data.productsSell[i]._id, register.receipt) === -1){
            $("#registerReceipt").append("<div class='row receiptRow' data-id='"+data.productsSell[i]._id+"' data-price='"+data.productsSell[i].productPrice+"'><p class='col-lg-8 col-md-8 col-sm-8 col-xs-7'>"+data.productsSell[i].productName+"</p><p class='col-lg-2 col-md-2 col-sm-2 col-xs-2 quantityProduct' data-quantity='1' data-id='"+data.productsSell[i]._id+"'>x 1</p><p class='col-lg-2 col-md-2 col-sm-2 col-xs-3 productPrice' data-id='"+data.productsSell[i]._id+"'>$"+data.productsSell[i].productPrice+"<button type='button' class='close' id='removeProduct' data-id='"+data.productsSell[i]._id+"'>&times;</button></p></div>");
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
    $("#createTable").addClass("disabled");
    $("#readyToPay").removeClass("disabled");
  },

  modalTotal: function(){
    register.temporalTotal=register.total;
    $(".modal-header").empty();
    $(".modal-body").empty();
    $(".modal-footer").empty();
    $(".modal-header").append("<a type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</a>");
    $(".modal-header").append("<h4 class='modal-title'>Payment</h4>");
    $(".modal-body").append("<div class='row' id='modalBodyTotal'></div>");
    $("#modalBodyTotal").append("<div class='col-lg-4' id='amount'><h1>$"+register.total+"</h1></div>");
    $("#modalBodyTotal").append("<div class='col-lg-8'><label for='payInput' class='col-lg-4 control-label'>Amount</label><div class='col-lg-6'><input id='payInput' class='form-control' type='integer'></div></div>");
    $(".modal-footer").append("<a href='#' class='btn btn-primary col-lg-4' id='paymentTotal'>Pay</a><h4>Say thanks</h4>");
  },

  paymentReady: function(){
    var usingTable=false;
    if (register.tableAccount===0){
    register.createReceipt(usingTable);
    } else if (register.tableAccount===1){
    register.updateReceipt(usingTable);
    }
  }
};

$(document).ready(function(){
  register.displayCategories();
  register.displayActiveTables();
});

$(document).on("click", "#readyToPay", function() {
  register.modalTotal();
});

$(document).on("click", "#updateReceipt", function(){
  var usingTable=true;
  register.updateReceipt(usingTable);
});

$(document).on("click", "#createTable", function() {
  var usingTable=true;
  if (register.tableAccount===0){
    register.customerTable();
    $(document).on("click", "#openTable", function(){
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
  var minusProduct=$(".receiptRow").filter("[data-id='"+thisId+"']").attr("data-price");
  var getQuantity=$(".quantityProduct").filter("[data-id='"+thisId+"']").attr("data-quantity");
  var minusTotal=minusProduct/getQuantity;
  var minusProductTotal=minusProduct-minusTotal;
  var minusQuantity=getQuantity-1;
  console.log("minus " + minusTotal);
  register.total=register.total-minusTotal;
  if (minusQuantity===0){
    $(".receiptRow").filter("[data-id='"+thisId+"']").remove();
  } else {
    $(".receiptRow").filter("[data-id='"+thisId+"']").attr("data-price", minusProductTotal);
    $(".quantityProduct").filter("[data-id='"+thisId+"']").attr("data-quantity", minusQuantity);
    $(".productPrice").filter("[data-id='"+thisId+"']").html("$"+minusProductTotal+"<button type='button' class='close' id='removeProduct' data-id='"+thisId+"'>&times;</button>");
    $(".quantityProduct").filter("[data-id='"+thisId+"']").html("x "+minusQuantity);
  }
  register.displayTotal();
  for(i=0; i<register.receipt.length; i++){
    if (register.receipt[i]===thisId){
      register.receipt.splice(i, 1);
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
    register.addToReceipt(thisId);
  } else {
    register.duplicateProduct(thisId, false);
  }
});

$(document).on("click", "#paymentTotal", function(){
  var payment=$("#payInput").val();
  console.log("payment: "+payment);
  register.temporalTotal=register.temporalTotal-payment;
  if(register.temporalTotal===0){
    register.paymentReady();
    $('#payModal').modal('hide');
    register.temporalTotal=0;
  } else if (register.total<payment){
    var change=Math.abs(register.temporalTotal);
    $("#modalBodyTotal").html("<div class='col-lg-12'><h1> Change: $"+change+"</h1></div>");
    $(".modal-footer").html("<h4>Say thanks</h4>");
    register.temporalTotal=0;
    register.paymentReady();
  } else if (register.total>payment){
    var remain=Math.abs(register.temporalTotal);
    $("#payInput").val("");
    $("#amount").html("<h1>Remain: $"+remain+"</h1>");
  }
});
