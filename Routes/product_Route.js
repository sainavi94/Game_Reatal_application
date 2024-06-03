const express = require('express');
const { getaProduct, getAllProducts, wishList, createProduct, cart, placeOrder, updateProduct } = require('../controllers/product_controller');


const router = express.Router();

router.post('/new-product', createProduct);
router.get('/fetch', getAllProducts);
router.put('/update/:productID', updateProduct);
router.get('/get/:productID', getaProduct);


router.put('/save/remove', wishList);
router.put('/add/remove', cart);
router.post('/placeOrder', placeOrder);






module.exports = router
