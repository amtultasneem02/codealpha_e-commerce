import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ShoppingCart, Loader2, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Product not found');
        }

        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: '#6366f1' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> Back to Products
        </Link>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ChevronLeft size={16} /> Back to Products
      </Link>

      <div className="product-detail-container">
        <div className="product-detail-img-card">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600';
            }}
          />
        </div>

        <div className="product-detail-info">
          <div className="detail-header">
            <span className="product-category">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>
            <div className="rating-container" style={{ margin: '0.5rem 0 1rem' }}>
              <Star size={16} fill="currentColor" />
              <span style={{ fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
              <span className="rating-reviews">({product.numReviews} customer reviews)</span>
            </div>
            <div className="detail-price">₹{product.price.toLocaleString('en-IN')}</div>
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="purchase-card">
            <div className="purchase-row">
              <span>Price:</span>
              <span style={{ fontWeight: 700 }}>₹{product.price.toLocaleString('en-IN')}</span>
            </div>

            <div className="purchase-row">
              <span>Status:</span>
              <span>
                {product.countInStock > 0 ? (
                  <span className="badge badge-success">In Stock ({product.countInStock})</span>
                ) : (
                  <span className="badge badge-danger">Out of Stock</span>
                )}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="purchase-row">
                <span>Quantity:</span>
                <select
                  className="qty-select"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <button
                className="btn"
                style={{ width: '100%', padding: '1rem' }}
                disabled={product.countInStock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} /> Add to Shopping Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
