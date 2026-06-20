import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();

  const checkoutHandler = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag className="empty-icon" size={60} />
        <h2>Your Cart is Empty</h2>
        <p>Before you checkout, you must add some premium items to your shopping cart.</p>
        <Link to="/" className="btn">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
        Shopping Cart
      </h1>

      <div className="cart-layout">
        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.product}>
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600';
                }}
              />
              
              <div className="cart-item-info">
                <Link to={`/products/${item.product}`} className="cart-item-title">
                  {item.name}
                </Link>
                <span className="cart-item-brand">Tech Store Brand</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select
                  className="qty-select"
                  value={item.qty}
                  onChange={(e) => addToCart({ _id: item.product }, Number(e.target.value))}
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.15)' }}
                  onClick={() => removeFromCart(item.product)}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="cart-item-price">
                ₹{(item.price * item.qty).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div className="purchase-card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            Order Summary
          </h2>

          <div className="purchase-row">
            <span>Items Subtotal:</span>
            <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="purchase-row">
            <span>Shipping:</span>
            <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toLocaleString('en-IN')}`}</span>
          </div>

          <div className="purchase-row">
            <span>Tax (15%):</span>
            <span>₹{taxPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="purchase-row" style={{ fontSize: '1.2rem', color: '#6366f1', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.5rem', paddingTop: '1rem' }}>
            <span>Total Price:</span>
            <span style={{ fontWeight: 800 }}>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              className="btn"
              style={{ width: '100%', padding: '1rem' }}
              onClick={checkoutHandler}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
