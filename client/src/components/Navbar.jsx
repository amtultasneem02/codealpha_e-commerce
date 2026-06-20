import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ShoppingCart, User, LogOut, History } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <ShoppingBag size={24} style={{ color: '#6366f1' }} />
          <span>AeroShop</span>
        </Link>

        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <div className="cart-badge-container">
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
            <span>Cart</span>
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/orders"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <History size={16} />
                <span>Orders</span>
              </NavLink>

              <div className="user-menu">
                <span className="user-btn">
                  <User size={16} />
                  <span>{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="nav-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <User size={16} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
