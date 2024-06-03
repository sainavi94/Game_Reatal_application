const Product = require('../models/product_Model')
const User = require('../models/user_Model')


// Product creation

const createProduct = async (req, res) => {
  try {
    // Extract request data
    const {
      title,
      thumbnailURL,
      sellerUsername,
      unitsAvailable,
      productType,
      productImages,
      rentalPricePerWeek,
      rentalPricePerMonth
    } = req.body;

    // Check if all required fields are present
    if (!title || !thumbnailURL || !sellerUsername || !unitsAvailable || !productType || !productImages || !rentalPricePerWeek || !rentalPricePerMonth) {
      return res.status(400).json({ error: 'Missing required fields', status: 'FAILURE', statusCode: 400  });
    }

    // Check if product type is valid
    if (!['console', 'controller', 'game'].includes(productType)) {
      return res.status(400).json({ error: 'Invalid product type', status: 'FAILURE', statusCode: 400  });
    }

    // Create a new product document
    const newProduct = new Product({
      title,
      thumbnailURL,
      sellerUsername,
      unitsAvailable,
      productType,
      productImages,
      rentalPricePerWeek,
      rentalPricePerMonth
    });

    // Save the new product to the database
    await newProduct.save();

    // Send success response
    res.status(200).json(newProduct);
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: error.message,  status: 'FAILURE', statusCode: 400  });
  }
};

// Find the product by its ID in the database



const getaProduct = async (req, res) => {
  const { productID } = req.params;

  try {
    // Find the product by its ID in the database
    const productDetail = await Product.findOne({ _id: productID });

    // If product not found, send 404 status with error message
    if (!productDetail) {
      return res.status(404).json({ error: 'Product Not Found', status: 'FAILURE', statusCode: 400 });
    }

    // If product found, send success response with product details
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 200,
      data: productDetail
    });
  } catch (error) {
    // If any error occurs during database operation, send 500 status with error message
    res.status(500).json({ error: 'Internal Server Error', status: 'FAILURE', statusCode: 500 });
  }
};



// Find the all products from database


const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({});
   
    // Send the response with the array of products
    res.json(products);
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: 'Internal Server Error', status: 'FAILURE', statusCode: 500  });
  }
};
// Update product

const updateProduct = async (req, res) => {
  const { productID } = req.params;
  const {
    title,
    thumbnailURL,
    sellerUsername,
    unitsAvailable,
    productType,
    productImages,
    rentalPricePerWeek,
    rentalPricePerMonth
  } = req.body;

  try {
    // Check if the product exists
    const existingProduct = await Product.findByIdAndUpdate({ _id: productID });
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product Not Found',status: 'FAILURE', statusCode: 404  });
    }

    // Update product details
    existingProduct.title = title;
    existingProduct.thumbnailURL = thumbnailURL;
    existingProduct.sellerUsername = sellerUsername;
    existingProduct.unitsAvailable = unitsAvailable;
    existingProduct.productType = productType;
    existingProduct.productImages = productImages;
    existingProduct.rentalPricePerWeek = rentalPricePerWeek;
    existingProduct.rentalPricePerMonth = rentalPricePerMonth;

    // Save updated product details
    await existingProduct.save();

    // Send success response
    res.status(200).json({
      status: 'SUCCESS',
      statusCode: 200,
      data:  {existingProduct }
  })
  } catch (error) {
    // Send appropriate error response
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message, status: 'FAILURE', statusCode: 400  });
    }
    res.status(500).json({ error: 'Internal Server Error', status: 'FAILURE', statusCode: 500  });
  }
};


//   Save/Remove from Wishlist:

const wishlists = {};

// API endpoint to add or remove products from the wishlist
const wishList = async (req, res) => {
  try {
    const { userID, productID } = req.body;

    // Find the user by userID
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the product is already in the wishlist
    const index = user.wishlist.indexOf(productID);
    if (index === -1) {
      // Product not in wishlist, add it
      user.wishlist.push(productID);
    } else {
      // Product already in wishlist, remove it
      user.wishlist.splice(index, 1);
    }

    // Save the updated user object
    await user.save();

    // Fetch details of products in the wishlist
    const wishlistProducts = await Product.find({ _id: { $in: user.wishlist } });

    // Construct response data
    const product = wishlistProducts.map(product => ({
      productID: product._id,
      title: product.title,
      thumbnailURL: product.thumbnailURL,
      sellerUsername: product.sellerUsername,
      unitsAvailable: product.unitsAvailable,
      productType: product.productType,
      rentalStartingFromPrice: product.rentalPricePerWeek
    }));

    // Send success response with updated wishlist
    res.status(200).json({
      statusCode: 200,
      status: 'SUCCESS',
      data: product
    });
  } catch (error) {
    // If an error occurs, send an error response
    console.error(error);
    res.status(400).json({ error: 'Bad Request' });
  }
};

const cart = async (req, res) => {
  try {
    const { userID, productID, count, bookingStartDate, bookingEndDate } = req.body;

    // Find the user by userID
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the product by productID
    const product = await Product.findOne({ _id: productID });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if count is more than unitsAvailable
    if (count > product.unitsAvailable) {
      return res.status(400).json({ error: `Only ${product.unitsAvailable} units available` });
    }

    // Check if the product already exists in the cart
    const cartItemIndex = user.cart.findIndex(item => item.product && item.product.equals(productID));

    if (cartItemIndex === -1) {
      // Product not in cart, add it
      user.cart.push({
        product: productID,
        count,
        bookingStartDate,
        bookingEndDate
      });
    } else {
      // Product already in cart, remove it and add the updated product
      user.cart.splice(cartItemIndex, 1); // Remove the existing product from the cart
      user.cart.push({
        product: productID,
        count,
        bookingStartDate,
        bookingEndDate
      });
    }

    // Save the updated user object
    await user.save();

    // Fetch details of products in the cart
    const cartProducts = await Promise.all(user.cart.map(async (item) => {
      // Find the product by item.product
      const product = await Product.findById(item.product);
      // If product not found or null, return null
      if (!product) return null;
      return {
        productID: product._id,
        title: product.title,
        thumbnailURL: product.thumbnailURL,
        sellerUsername: product.sellerUsername,
        count: item.count,
        unitsAvailable: product.unitsAvailable,
        productType: product.productType,
        bookingStartDate: item.bookingStartDate,
        bookingEndDate: item.bookingEndDate,
        rentedAtPrice: `${product.rentalPricePerWeek}/week, ${product.rentalPricePerMonth}/month`
      };
    }));

    // Filter out null values (products not found)
    const validCartProducts = cartProducts.filter(product => product !== null);

    // Send success response with updated cart
    res.status(200).json(validCartProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const placeOrder = async (req, res) => {
  try {
    const { userID } = req.body;
    
    // Find the user by userID
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the products in the user's cart
    const cartProducts = await Product.find({ _id: { $in: user.cart.map(item => item.product) } });

    // Create an order object for each product in the cart
    const orders = cartProducts.map(product => {
      const cartItem = user.cart.find(item => item.product && item.product.equals(product._id));
      if (!cartItem) {
        return null; // Handle case where cart item is not found
      }
      return {
        productID: product._id,
        title: product.title,
        thumbnailURL: product.thumbnailURL,
        sellerUsername: product.sellerUsername,
        unitsAvailable: product.unitsAvailable,
        productType: product.productType,
        bookingStartDate: cartItem.bookingStartDate,
        bookingEndDate: cartItem.bookingEndDate,
        rentedAtPrice: `${product.rentalPricePerWeek}/week, ${product.rentalPricePerMonth}/month`,
        count: cartItem.count
      };
    }).filter(order => order !== null); // Remove null orders

    // Update stock for each product
    await Promise.all(cartProducts.map(async (product) => {
      const cartItem = user.cart.find(item => item.product && item.product.equals(product._id));
      if (!cartItem) {
        return; // Skip if cart item is not found
      }
      product.unitsAvailable -= cartItem.count;
      await product.save();
    }));

    // Empty the user's cart
    user.cart = [];
    await user.save();

    // Send success response with details of ordered products
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getaProduct, getAllProducts, wishList, createProduct, cart, placeOrder, updateProduct
}