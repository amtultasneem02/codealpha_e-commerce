import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    clearCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    navigate('/cart');
  }

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  // Shipping details state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Payment details state
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping details');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'UPI') {
      if (!upiId) {
        setError('Please enter a valid UPI ID');
        return;
      }
      if (!upiId.includes('@')) {
        setError('UPI ID must contain "@" (e.g. name@okaxis, 9876543210@paytm)');
        return;
      }
    } else {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        setError('Please fill in card details');
        return;
      }
    }
    setError('');
    setStep(3);
  };

  const placeOrderHandler = async () => {
    setPlacingOrder(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item.product,
          })),
          shippingAddress: {
            address,
            city,
            postalCode,
            country,
          },
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error placing order');
      }

      clearCart();
      navigate(`/orders`);
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Checkout Steps Progress Banner */}
      <div className="checkout-steps">
        <div className={`checkout-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <span className="step-num">{step > 1 ? <CheckCircle2 size={14} /> : '1'}</span>
          <span>Shipping</span>
        </div>
        <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--border)' }}></div>
        <div className={`checkout-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <span className="step-num">{step > 2 ? <CheckCircle2 size={14} /> : '2'}</span>
          <span>Payment</span>
        </div>
        <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--border)' }}></div>
        <div className={`checkout-step ${step === 3 ? 'active' : ''}`}>
          <span className="step-num">3</span>
          <span>Review & Place</span>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="checkout-layout">
        {/* Step 1: Shipping Address Form */}
        {step === 1 && (
          <div className="checkout-card">
            <h3>Shipping Address</h3>
            <form onSubmit={handleShippingSubmit}>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="12, 100 Feet Road, Indiranagar"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Pincode (Postal Code)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="560038"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
                Continue to Payment <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Payment Details Simulation Form */}
        {step === 2 && (
          <div className="checkout-card">
            <h3>Payment Method</h3>
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => { setPaymentMethod('UPI'); setError(''); }}
                  />
                  UPI (GPay / PhonePe)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={() => { setPaymentMethod('Card'); setError(''); }}
                  />
                  Credit / Debit Card
                </label>
              </div>

              {paymentMethod === 'UPI' ? (
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="9876543210@paytm or username@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Expiration Date</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">CVC</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn" style={{ flex: 1.5 }}>
                  Review Order <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Review Order Summary */}
        {step === 3 && (
          <div className="checkout-card">
            <h3>Review Your Order</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Shipping To</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {address}, {city}, {postalCode}, {country}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Payment Method</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {paymentMethod === 'UPI' ? (
                  `UPI ID: ${upiId}`
                ) : (
                  <>
                    <CreditCard size={16} /> Card ending in {cardNumber.slice(-4)}
                  </>
                )}
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Order Items</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cartItems.map((item) => (
                  <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span>{item.qty}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>
                Back
              </button>
              <button
                type="button"
                className="btn"
                style={{ flex: 1.5 }}
                disabled={placingOrder}
                onClick={placeOrderHandler}
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Right Panel: Side summary showing total calculations */}
        <div className="purchase-card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            Summary
          </h2>
          <div className="purchase-row" style={{ fontSize: '0.9rem' }}>
            <span>Items Subtotal:</span>
            <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="purchase-row" style={{ fontSize: '0.9rem' }}>
            <span>Shipping:</span>
            <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toLocaleString('en-IN')}`}</span>
          </div>
          <div className="purchase-row" style={{ fontSize: '0.9rem' }}>
            <span>Tax (18% GST):</span>
            <span>₹{taxPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="purchase-row" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
            <span>Order Total:</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
