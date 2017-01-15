// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ProductSchema = new Schema({
  // title is a required string
  productName: {
    type: String,
    required: true
  },
  // price is a required integer
  productPrice: {
    type: Number,
    required: true
  },
  productCategory: {
    type: String,
    required: true,
    enum: ['drinks', 'bakery','pastry', 'brunch']
  }
});

// Create the Article model with the ArticleSchema
var Product = mongoose.model("Product", ProductSchema);

// Export the model
module.exports = Product;
