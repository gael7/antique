var kitchen={
  displayOrders: function(){
    $("#ordersPending").html("");
    $.getJSON("/receipts/pending", function(data){
      for(i=0; i<data.length; i++){
        $("#ordersPending").append("<div class='col-lg-4 col-md-4 col-sm-6'><div class='panel panel-warning'><div class='panel-heading'><h3 class='panel-title'>"+data[i].customerName+"</h3></div><div class='panel-body' id='"+data[i]._id+"'></div></div></div>");
        for (a=0; a<data[i].productsSell.length; a++){
          $("#"+data[i]._id).append("<ul>-"+data[i].productsSell[a].productName+"</ul>");
        }
        $("#"+data[i]._id).append("<div class='col-lg-6 col-lg-offset-3'><a class='btn btn-primary col-lg-12' id='readyButton' data-id='"+data[i]._id+"'>Order Ready</a></div>");
      }
    });
  },

};

$(document).ready(function(){
  kitchen.displayOrders();
});

$(document).on("click", "#readyButton", function(){
  var thisId=$(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/receipts/deliver/"+thisId,
    data: true
  }).done(function(data){
    console.log(data);
  });
  kitchen.displayOrders();
});
