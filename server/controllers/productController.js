import Product from '../models/Product.js';

// @desc    Fetch all products with sorting/filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, sort } = req.query;
    let query = {};

    if (keyword) {
      query.name = {
        $regex: keyword,
        $options: 'i',
      };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let productQuery = Product.find(query);

    if (sort) {
      if (sort === 'price_asc') {
        productQuery = productQuery.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        productQuery = productQuery.sort({ price: -1 });
      } else if (sort === 'rating') {
        productQuery = productQuery.sort({ rating: -1 });
      }
    } else {
      productQuery = productQuery.sort({ createdAt: -1 });
    }

    const products = await productQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid product ID' });
  }
};
