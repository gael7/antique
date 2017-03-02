var Product = require("../models/Product.js");
var Receipt = require("../models/Receipt.js");
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));
var nodemailer = require('nodemailer');
var moment = require('moment-timezone');

module.exports=function(router, passport){
//HTML routes
router.get('/', function(req, res){
  res.render('login');
});

router.post('/registration', passport.authenticate('local-registration'), function(req, res){
  res.json({redirect: '/login'});
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', passport.authenticate('local-login'), function(req, res) {
  res.json({redirect: '/management'});
});

router.get('/secret', function(req, res){
  res.render('registration');
});

router.post('/emailReceipt', function(req, res){
  var ticketID=req.body.receiptID;

  Receipt.findOne({"_id": ticketID}).populate('productsSell')
  .then(function(doc){
    var receipt=doc;
    var products=[];
    var productsHTML='<div id="products" style="padding-top: 5px;">';
    var htmlString='<div id="receipt" style="border-style: solid; border-width: 1px; display: inline-block">'+
      '<div id="header" style="border-style: dashed; border-width: 0px 0px 1px 0px; margin: 0px 10px">'+
      '<h2 style="text-align: center; margin-bottom: 0px">Antique</h2>'+
      '<p style="text-align: center; margin: 0px">Campeche #1822</p>'+
      '<p style="text-align: center; margin: 0px">Nuevo Laredo, Tamaulipas</p>'+
      '<p style="text-align: center; margin: 0px">+52 (867) 714 9351 </p></div>';
      for(i=0; i<receipt.productsSell.length; i++){
        if(products.indexOf(receipt.productsSell[i]._id)===-1){
        var count=0;
        for (a=0; a<receipt.productsSell.length; a++){
          if (receipt.productsSell[a]._id===receipt.productsSell[i]._id){
            count++;
          }
        }
        var price=receipt.productsSell[i].productPrice*count;
        productsHTML=productsHTML+'<div style="padding-top: 5px; clear: both;"><p id="name" style="display: inline-block; float: left; margin: 1px 10px">'+count+" "+receipt.productsSell[i].productName+'</p><p id="price" style="display: inline-block; float: right; margin: 1px 10px">$'+price+'</p></div>';
        products.push(receipt.productsSell[i]._id);
      }
    }
      htmlString=htmlString+productsHTML+'</div><div id="total" style="padding-top: 10px; clear: both;">'+
      '<p style=" text-align: right; margin-right: 10px"><b>$'+receipt.totalToPay+'</b></p></div></div>';
      //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: "gaelarrambide@gmail.com",
              pass: "071592gael"
          }
      });
      //Mail options
      var mailOpts = {
          from: '"Antique" <gaelarrambide@gmail.com>', //grab form data from the request body object
          to: req.body.email,
          subject: 'Su ticket de Compra',
          text: ticketID,
          html: htmlString
      };
      transporter.sendMail(mailOpts, function (error, info) {
        if (error) {
            return console.log(error);
        }
        res.json({message: "Send"});
      });

    }).catch(function(error){
      console.log(error);
  });


});


router.get('/management', isLoggedIn, function(req, res){
  var isAdm=req.session.passport.user.local.isAdm;
  if (isAdm===true){
  res.render('management');
} else if(isAdm===false){
  res.redirect('/register');
}
});

router.get('/kitchen', isLoggedIn, function(req, res){
  res.render('kitchen');
});

router.get('/register', isLoggedIn, function(req, res){
  res.render('register');
});

//Products Routes
router.get('/products', function(req, res){
  Product.find({}).sort('-productCategory')
  .then(function(doc){
      res.json(doc);
  }).catch(function(error){
    console.log(error);
  });
});

router.get('/products/:id', function(req, res){
  Product.findOne({"_id": req.params.id})
  .then(function(doc){
      res.json(doc);
    }).catch(function(error){
      console.log(error);
    });
});

router.get('/products/byCategory/:category', function(req, res){
  Product.find({productCategory: req.params.category})
  .then(function(doc){
      res.json(doc);
  }).catch(function(error){
    console.log(error);
  });
});

router.post('/addProduct', function(req, res){
  //Create new product and pass the req.body to the entry
  var newProduct= new Product(req.body);
  newProduct.saveAsync().then(function(doc){
    res.json({message: "Product added"});
  }).catch(function(error){
    console.log(error);
  });
});

router.put('/updateProduct/:id', function(req, res){
  Product.findOneAndUpdate({"_id": req.params.id}, {"productName": req.body.productName, "productPrice": req.body.productPrice, "productCategory": req.body.productCategory})
  .then(function(doc){
      res.send(doc);
    }).catch(function(error){
      console.log(error);
  });
});

router.delete('/deleteProduct/:id', function(req, res){
  Product.findByIdAndRemoveAsync({"_id": req.params.id}).then(function(doc){
    res.json({message: "Product Deleted"});
  }).catch(function(error){
      console.log(error);
  });
});

//Receipt Routes
router.post('/createReceipt', function(req, res){
  //Create new receipt and pass the req.body to the entry
  req.body.productsSell=JSON.parse(req.body.productsSell);
  var newReceipt= new Receipt(req.body);
  newReceipt.saveAsync().then(function(doc){
    res.json(doc._id);
  }).catch(function(error){
    console.log(error);
  });
});

router.get('/receipts', function(req, res){
  Receipt.find({}).then(function(doc){
    res.json(doc);
  }).catch(function(error){
    console.log(error);
  });
});

router.get('/receipts/byDate/:receiptsdate1/:receiptsdate2', function(req, res){
  date1=req.params.receiptsdate1+"T00:00:00Z";
  date2=req.params.receiptsdate2+"T23:59:59Z";
  date1=moment(date1).utcOffset('+06:00').format();
  date2=moment(date2).utcOffset('+06:00').format();
  date1=date1.split("T");
  date11=date1[1].split("+");
  date1=date1[0]+"T"+date11[0]+".000Z";
  date2=date2.split("T");
  date21=date2[1].split("+");
  date2=date2[0]+"T"+date21[0]+".000Z";
  Receipt.find({"date": {"$gte": date1,"$lt":date2 }}).then(function(doc){
      res.json(doc);
    }).catch(function(error){
      console.log(error);
  });
});

router.get('/receipts/activeTables', function(req, res){
  Receipt.find({activeTable: true}).then(function(doc){
      res.json(doc);
    }).catch(function(error){
      console.log(error);
  });
});

router.get('/receipts/activeTables/:id', function(req, res){
  Receipt.findOne({"_id": req.params.id}).populate('productsSell')
  .then(function(doc){
      res.json(doc);
    }).catch(function(error){
      console.log(error);
  });
});

router.get('/receipts/pending', function(req, res){
  Receipt.find({deliver: false}).populate('productsSell')
  .then(function(doc){
      res.json(doc);
    }).catch(function(error){
      console.log(error);
  });
});

router.put('/updateReceipt/:id', function(req, res){
  req.body.productsSell=JSON.parse(req.body.productsSell);
  Receipt.findOneAndUpdate({"_id": req.params.id}, {"activeTable": req.body.activeTable, "productsSell": req.body.productsSell, "totalToPay": req.body.totalToPay})
  .then(function(doc){
      res.send(doc);
    }).catch(function(error){
      console.log(error);
  });
});

router.put('/receipts/deliver/:id', function(req, res){
  Receipt.findOneAndUpdate({"_id": req.params.id}, {"deliver": req.body})
  .then(function(doc){
      res.send(doc);
    }).catch(function(error){
      console.log(error);
  });
});

router.delete('/deleteReceipt/:id', function(req, res){
  Receipt.findByIdAndRemoveAsync({"_id": req.params.id}).then(function(doc){
    res.json({message: "Receipt Deleted"});
  }).catch(function(error){
    console.log(error);
  });
});

router.delete('/deleteReceipts/', function(req, res){
  Receipt.remove({}).then(function(doc){
  }).catch(function(error){
    console.log(error);
  });
});
};

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
