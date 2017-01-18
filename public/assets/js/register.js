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
      register.receipt.push(product);
    });
    console.log(register.receipt);
  },

  createReceipt: function(table, customerName){
    //console.log("createReceipt function: "+register.receipt);
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
      receiptInfo={};
      $("#registerReceipt").html("");
      $("#registerTotal").html("");
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
          $("#registerReceipt").append("<div class='row'><p class='col-lg-10'>"+data.productsSell[i].productName+"</p><p class='col-lg-2'>$"+data.productsSell[i].productPrice+"</p></div>");
          register.receipt.push(data.productsSell[i]._id);
        }
      register.total=data.totalToPay;
      $("#registerTotal").html("<div class='row'><p class='col-lg-10'>Total: </p><p class='col-lg-2'>$"+register.total+"</p></div>");
    });
    $("#registerButtons").append("<a href='#' class='btn btn-info col-lg-2' id='updateReceipt'>Update</a>");
  }
};

register.displayCategories();
register.displayActiveTables();

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
      register.customerName=$("#customerName").val().trim();
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

$(document).on("click", "#tableButtons", function() {
  var thisId=$(this).attr("data-id");
  register.getReceipt(thisId);
});

$(document).on("click", "#product", function() {
  var thisId=$(this).attr("data-id");
  register.addToReceipt(thisId);
});
