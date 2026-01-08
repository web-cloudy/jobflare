import React from 'react'
import './Legal.css'

const Cookies = ({ onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('legal-modal')) {
      onClose();
    }
  };

  return (
    <div className="legal-modal" onClick={handleOverlayClick}>
      <div className="legal-content">
        <button className="legal-close" onClick={onClose}>&times;</button>
        <h1>Cookies Policy</h1>
        <p className="last-updated">Last Updated: November 20, 2025</p>
        
        <section>
          <h2>1. What are Cookies</h2>
          <p>Cookies are small text files stored on your device that help us enhance your experience on JobFlare.ai.</p>
        </section>

        <section>
          <h2>2. How We Use Cookies</h2>
          <p>We use cookies to remember your preferences, analyze site traffic, and provide a more personalized experience.</p>
        </section>

        <section>
          <h2>3. Types of Cookies We Use</h2>
          <p>We use both essential cookies (required for site functionality) and analytical cookies (to help us improve the site).</p>
        </section>

        <section>
          <h2>4. Managing Cookies</h2>
          <p>You can control or reset your cookies through your web browser settings. However, disabling cookies may affect site functionality.</p>
        </section>
      </div>
    </div>
  )
}

export default Cookies
