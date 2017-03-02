// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ReceiptSchema = new Schema({
  customerName: {
    type: String,
  },
  // Date for receipt is a required string
  date: {
    type: Date,
    default: Date.now()
  },
  //Is it an active table
  activeTable: {
    type: Boolean,
    required: true
  },
  deliver: {
    type: Boolean,
    default: false,
    required: true
  },
  //Products on the receipt
  productsSell: [{
    type:Schema.Types.ObjectId,
    ref: "Product"
  }],
  //Total to pay
  totalToPay: {
    type: Number,
    required: true
  }
});

// Create the Article model with the ArticleSchema
var Receipt = mongoose.model("Receipt", ReceiptSchema);

// Export the model
module.exports = Receipt;
