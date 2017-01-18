var express=require('express');
var router=express.Router();
var Product = require("../models/Product.js");
var Receipt = require("../models/Receipt.js");

router.get('/', function(req, res){
  res.render('index');
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

router.post('/updateReceipt/:id', function(req, res){
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
module.exports=router;
