import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Calendar, Clipboard, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: '#6366f1' }} />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <Clipboard className="empty-icon" size={60} />
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet. Head to the catalog to purchase premium tech!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
        Order History
      </h1>

      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              return (
                <React.Fragment key={order._id}>
                  <tr>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {order._id.substring(0, 10).toUpperCase()}...
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700 }}>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td>
                      {order.isPaid ? (
                        <span className="badge badge-success">
                          Paid on {new Date(order.paidAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="badge badge-danger">Unpaid</span>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span className="badge badge-success">
                          Delivered {new Date(order.deliveredAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="badge badge-danger">Processing</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }}
                        onClick={() => toggleExpand(order._id)}
                      >
                        {isExpanded ? (
                          <>
                            Hide <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            Show <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Detail Row Drawer */}
                  {isExpanded && (
                    <tr>
                      <td colSpan="6" style={{ backgroundColor: 'rgba(255,255,255,0.015)', padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#6366f1' }}>Items Ordered</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {order.orderItems.map((item) => (
                                <div
                                  key={item._id}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingBottom: '0.5rem',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  <span>
                                    {item.qty}x {item.name}
                                  </span>
                                  <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#6366f1' }}>Shipping Address</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                              {order.shippingAddress.address}
                              <br />
                              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                              <br />
                              {order.shippingAddress.country}
                            </p>

                            {order.paymentResult && (
                              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '0.75rem' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem', color: '#6366f1' }}>Payment ID</h4>
                                <p style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                                  {order.paymentResult.id}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
