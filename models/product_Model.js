const mongoose = require('mongoose');

// Define product schema
const productSchema = new mongoose.Schema({
 
  title: {
    type: String,
    required: true
  },
  thumbnailURL: String,
  sellerUsername: {
    type: String,
    required: true
  },
  unitsAvailable: {
    type: Number,
    required: true
  },
  productType: {
    type: String,
    enum: ['game', 'controller', 'console'],
    required: true
  },
  productImages: [String],
  rentalPricePerWeek: {
    type: Number,
    required: true
  },
  rentalPricePerMonth: {
    type: Number,
    required: true
  }
});

// Define product model
module.exports = mongoose.model('Product', productSchema);




