const express = require('express');
const router = express.Router();
const { addProduct, getProducts, updateStock } = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, addProduct);
router.get('/', verifyToken, getProducts);
router.put('/:id', verifyToken, updateStock);

module.exports = router;