import './Footer.css'

const Footer = ({ onPolicyClick }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">JobFlare.ai</h3>
            <p className="footer-tagline">Find flexible work for your unique skills</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#benefits">Benefits</a>
              <a href="#how-it-works">How it Works</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <button className="footer-btn" onClick={() => onPolicyClick('terms')}>Terms of Service</button>
              <button className="footer-btn" onClick={() => onPolicyClick('privacy')}>Privacy Policy</button>
              <button className="footer-btn" onClick={() => onPolicyClick('cookies')}>Cookies Policy</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 JobFlare.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer





