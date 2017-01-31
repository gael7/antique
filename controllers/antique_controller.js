var express=require('express');
var router=express.Router();
var Product = require("../models/Product.js");
var Receipt = require("../models/Receipt.js");
var User = require("../models/User.js");

//HTML routes
router.get('/', function(req, res){
  res.render('login');
});

router.post('/registration', function(req, res, next) {
  newUser = new User(req.body);
  newUser.save(function(error, doc){
    if(error){
      console.log(error);
    } else {
      res.json({redirect: '/management'});
    }
  });
});

router.post('/login', function(req, res, next) {
  User.getAuthenticated(req.body, function(err, token, user) {
      if (err) throw err;
      else if(token){
          res.json({token: token, user: user, redirect: "/management"});
        }
      });
});
router.get('/secret', function(req, res){
  res.render('registration');
});

router.get('/management', function(req, res){
  res.render('management');
});

router.get('/kitchen', function(req, res){
  res.render('kitchen');
});

router.get('/register', function(req, res){
  res.render('register');
});

//Products Routes
router.get('/products', function(req, res){
  Product.find({})
  .sort('-productCategory')
  .exec(function(error, doc){
    if(error){
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

router.get('/products/:id', function(req, res){
  Product.findOne({"_id": req.params.id}, function(error, doc){
    if(error){
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

router.get('/products/byCategory/:category', function(req, res){
  Product.find({productCategory: req.params.category}, function(error, doc){
    console.log(req.params.category);
    if(error){
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

router.post('/addProduct', function(req, res){
  //Create new product and pass the req.body to the entry
  var newProduct= new Product(req.body);

  newProduct.save(function(error, doc){
    if(error){
      console.log(error);
    } else {
      console.log(doc);
    }
  });
});

router.put('/updateProduct/:id', function(req, res){
  Product.findOneAndUpdate({"_id": req.params.id}, {"productName": req.body.productName, "productPrice": req.body.productPrice, "productCategory": req.body.productCategory})
  .exec(function(err, doc){
    if (err){
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

router.delete('/deleteProduct/:id', function(req, res){
  Product.findByIdAndRemove({"_id": req.params.id}, function(error, doc){
    if(error){
      console.log(error);
    }
  });
});

//Receipt Routes
router.post('/createReceipt', function(req, res){
  //Create new receipt and pass the req.body to the entry
  req.body.productsSell=JSON.parse(req.body.productsSell);
  console.log(req.body);

  var newReceipt= new Receipt(req.body);

  newReceipt.save(function(error, doc){
    if(error){
      console.log(error);
    } else {
      console.log(doc);
    }
  });
});

router.get('/receipts', function(req, res){
  Receipt.find({}, function(error, doc){
    if(error){
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

router.get('/receipts/activeTables', function(req, res){
  Receipt.find({activeTable: true}, function(error, doc){
    if(error){
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

router.get('/receipts/activeTables/:id', function(req, res){
  Receipt.findOne({"_id": req.params.id})
  .populate('productsSell')
  .exec(function(error, doc){
    if(error){
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

router.put('/updateReceipt/:id', function(req, res){
  req.body.productsSell=JSON.parse(req.body.productsSell);
  Receipt.findOneAndUpdate({"_id": req.params.id}, {"activeTable": req.body.activeTable, "productsSell": req.body.productsSell, "totalToPay": req.body.totalToPay})
  .exec(function(err, doc){
    if (err){
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

router.delete('/deleteReceipt/:id', function(req, res){
  Receipt.findByIdAndRemove({"_id": req.params.id}, function(error, doc){
    if(error){
      console.log(error);
    }
  });
});

router.delete('/deleteReceipts/', function(req, res){
  Receipt.remove({}, function(error, doc){
    if(error){
      console.log(error);
    }
  });
});

module.exports=router;
