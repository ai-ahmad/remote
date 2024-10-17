const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  volume: {
    type: Array,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    main_images: {
      type: [String],  // Array of image paths for main images
      required: true,
    },
    all_images: {
      type: [String],  // Array of image paths for all images
      required: true,
    },
  },
  ruler: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fidbek: {
    type: Array,
    required: false,
  },
  discount_price: {
    type: String,
    required: false,
    default: 0,
  },
  promotion: {
    type: Boolean,
    required: false,
  },
  bestseller: {
    type: Boolean,
    required: false,
  },
  oils_type: {
    type: String,
    required: false,
  },
  product_info_pdf: {
    type: String,
    required: false,
  },
});

module.exports =  mongoose.model('Product', productSchema);
