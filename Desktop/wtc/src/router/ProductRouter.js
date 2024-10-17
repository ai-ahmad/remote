const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Product =require('../models/ProdutModel')

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, 'uploads/pdf');  
    } else {
      cb(null, 'uploads/product');  
    }
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// CREATE Product
router.post('/create', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'product_info_pdf', maxCount: 1 }]), async (req, res) => {
  const { name, category, rating, price, volume, description, discount_price, promotion, stock, ruler, oils_type, fidbek } = req.body;

  // Collect file paths for the images and PDF
  const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
  const product_info_pdf = req.files['product_info_pdf'] ? req.files['product_info_pdf'][0].path : '';

  try {
    const newProduct = new Product({
      name, 
      category, 
      rating, 
      price, 
      volume, 
      stock, 
      ruler, 
      description, 
      fidbek, 
      image: images,  // Store the array of image paths
      product_info_pdf,  // Store the PDF path
      discount_price,
      promotion,
      oils_type
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// READ a single Product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// READ all Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// UPDATE Product by ID
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'product_info_pdf', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { name, category, rating, price, volume, description, discount } = req.body;

  // Handle file uploads for both image and PDF
  const image = req.files['image'] ? req.files['image'][0].path : null;
  const product_info_pdf = req.files['product_info_pdf'] ? req.files['product_info_pdf'][0].path : null;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        name, 
        category, 
        rating, 
        price, 
        volume, 
        image: image || undefined,  // Only update image if provided
        product_info_pdf: product_info_pdf || undefined,  // Only update PDF if provided
        description, 
        discount 
      },
      { new: true, omitUndefined: true }  // `omitUndefined` ensures only provided fields are updated
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE Product by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// FILTER Products by Category
router.get('/filters', async (req, res) => {
  const { category_name } = req.query;  // Get from query string
  try {
    let products;
    if (category_name && category_name !== 'all') {
      products = await Product.find({ category: category_name });
    } else {
      products = await Product.find();  // Return all products if no filter
    }
    res.status(200).json({ data: products });
  } catch (err) {
    res.status(500).json({ message: 'Error getting data', error: err.message });
  }
});

module.exports = router;