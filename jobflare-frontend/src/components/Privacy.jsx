import React from 'react'
import './Legal.css'

const Privacy = ({ onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('legal-modal')) {
      onClose();
    }
  };

  return (
    <div className="legal-modal" onClick={handleOverlayClick}>
      <div className="legal-content">
        <button className="legal-close" onClick={onClose}>&times;</button>
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 20, 2025</p>
        
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, complete profile details, or participate in tasks.</p>
        </section>

        <section>
          <h2>2. How We Use Information</h2>
          <p>We use the information to provide, maintain, and improve our services, process payments, and communicate with you.</p>
        </section>

        <section>
          <h2>3. Sharing of Information</h2>
          <p>We do not share your personal information with third parties except as required to provide our services or comply with legal obligations.</p>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>We implement reasonable measures to help protect your information from loss, theft, and unauthorized access.</p>
        </section>

        <section>
          <h2>5. Your Choices</h2>
          <p>You may update or correct your account information at any time by logging into your profile.</p>
        </section>
      </div>
    </div>
  )
}

export default Privacy
