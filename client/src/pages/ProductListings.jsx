import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?keyword=${keyword}&category=${category}`;
        if (sort) {
          url += `&sort=${sort}`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Could not load products');
        }
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, category, sort]);

  return (
    <div>
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search premium products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select
            className="filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by: Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
          <Loader2 className="animate-spin" size={40} style={{ color: '#6366f1' }} />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h2>No Products Found</h2>
          <p>We couldn't find any products matching your current search criteria.</p>
          <button className="btn" onClick={() => { setKeyword(''); setCategory('All'); setSort(''); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <Link to={`/products/${product._id}`} className="product-card-img-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600';
                  }}
                />
              </Link>
              <div className="product-card-body">
                <span className="product-category">{product.category}</span>
                <Link to={`/products/${product._id}`}>
                  <h3 className="product-title">{product.name}</h3>
                </Link>
                <div className="rating-container">
                  <Star size={14} fill="currentColor" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="rating-reviews">({product.numReviews} reviews)</span>
                </div>
                <div className="product-card-footer">
                  <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.countInStock > 0 ? (
                    <button
                      className="btn"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => addToCart(product, 1)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="badge badge-danger">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListings;
