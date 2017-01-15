var express=require('express');
var router=express.Router();
var Product = require("../models/Product.js");


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
  console.log(req.params.category);
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
  console.log(req.body.productName);
  console.log(req.body.productPrice);
  console.log(req.body.productCategory);

  var newProduct= new Product(req.body);

  newProduct.save(function(error, doc){
    if(error){
      console.log(error);
    } else {
      console.log(doc);
    }
  });
});

module.exports=router;
