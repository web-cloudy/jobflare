import React from 'react'
import './Legal.css'

const Terms = ({ onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('legal-modal')) {
      onClose();
    }
  };

  return (
    <div className="legal-modal" onClick={handleOverlayClick}>
      <div className="legal-content">
        <button className="legal-close" onClick={onClose}>&times;</button>
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: November 20, 2025</p>
        
        <section>
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using JobFlare.ai, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>JobFlare.ai provides a platform for professionals to contribute to AI training and earn additional income through project-based work.</p>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <p>Users are responsible for providing accurate information and maintaining the confidentiality of their account credentials.</p>
        </section>

        <section>
          <h2>4. Payments</h2>
          <p>Payments are processed weekly via PayPal, Zelle, Bank Transfer, or Cryptocurrencies for approved tasks.</p>
        </section>

        <section>
          <h2>5. Intellectual Property</h2>
          <p>All content and materials provided through the platform are the property of JobFlare.ai or its licensors.</p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>JobFlare.ai is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
        </section>
      </div>
    </div>
  )
}

export default Terms
