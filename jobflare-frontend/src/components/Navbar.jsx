import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isExplorePage = location.pathname.startsWith('/apply');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
  }, [location.pathname]);

  const handleDashboardClick = (e) => {
    e.preventDefault();
    
    // Always navigate to login page
    // Login page will check if admin and redirect accordingly
    navigate('/admin/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" style={{ cursor: 'pointer' }}>
          <img 
            src="/logo.png" 
            alt="JobFlare.ai" 
            className="logo-image" 
          />
        </Link>
        <div className="navbar-links">
          {isHomePage ? (
            <>
              <a href="#about">About</a>
              <a href="#benefits">Benefits</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#faqs">FAQs</a>
            </>
          ) : (
            <Link to="/" className="nav-btn">Home</Link>
          )}
          <Link 
            to="/apply" 
            className={`nav-btn explore-btn ${isExplorePage ? 'active' : ''}`} 
          >
            Explore Jobs
          </Link>
          <a 
            href="#" 
            onClick={handleDashboardClick}
            className={`dashboard-btn ${isAdmin ? 'admin' : ''}`}
          >
            Dashboard
          </a>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
