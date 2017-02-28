var Product = require("../models/Product.js");
var Receipt = require("../models/Receipt.js");
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));

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


router.get('/management', isLoggedIn, function(req, res){
  var isAdm=req.session.passport.user.local.isAdm;
  console.log(isAdm);
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
    res.json({message: "Receipt Created"});
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
  console.log(date1);
  console.log(date2);
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
    console.log("Receipts Deleted");
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
