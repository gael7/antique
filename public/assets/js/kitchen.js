var kitchen={
  displayOrders: function(){
    $("#ordersPending").html("");
    $.getJSON("/receipts/pending", function(data){
      for(i=0; i<data.length; i++){
        data[i].date=moment(data[i].date).tz('America/Regina').format();
        data[i].date=data[i].date.split("T");
        data[i].date[1]=data[i].date[1].split(".");
        data[i].date[1]=data[i].date[1][0].split("-");
        if(data[i].customerName===undefined){
          data[i].customerName="";
        }
        $("#ordersPending").append("<div class='col-lg-4 col-md-4 col-sm-6 col-xs-12'><div class='panel panel-warning'><div class='panel-heading'><h3 class='panel-title text-center'>"+data[i].customerName+"</h3><div class='row'><h3 class='panel-title col-lg-6'>"+data[i].date[0]+"</h3><h3 class='panel-title col-lg-6 text-right'>"+data[i].date[1][0]+"</h3></div></div><div class='panel-body' id='"+data[i]._id+"'></div></div></div>");
        for (a=0; a<data[i].productsSell.length; a++){
          $("#"+data[i]._id).append("<ul>-"+data[i].productsSell[a].productName+"</ul>");
        }
        $("#"+data[i]._id).append("<div class='col-lg-6 col-lg-offset-3'><a class='btn btn-primary col-lg-12' id='readyButton' data-id='"+data[i]._id+"'>Order Ready</a></div>");
      }
    });
  },

};

$(document).ready(function(){
  moment.tz.add("America/Regina|LMT MST MDT MWT MPT CST|6W.A 70 60 60 60 60|012121212121212121212121341212121212121212121212121215|-2AD51.o uHe1.o 1in0 s2L0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 66N0 1cL0 1cN0 19X0 1fB0 1cL0 1fB0 1cL0 1cN0 1cL0 M30 8x20 ix0 1ip0 1cL0 1ip0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 3NB0 1cL0 1cN0|19e4");
  kitchen.displayOrders();
});

$(document).on("click", "#readyButton", function(){
  var thisId=$(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/receipts/deliver/"+thisId,
    data: true
  }).done(function(data){
  });
  kitchen.displayOrders();
});
