import './Hero.css'

import { useNavigate } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <section className="hero section">
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1 className="hero-title">
            Earn Additional Income While Enhancing AI's Future
          </h1>
          <p className="hero-subtitle">
            Join thousands of professionals from diverse fields contributing to the next generation of AI technology
          </p>
          <div className="hero-features">
            <div className="hero-feature-card">
              <div className="feature-icon">👥</div>
              <div className="feature-content">
                <h3 className="feature-title">For All Professionals</h3>
                <p className="feature-text">Doctors, Developers, Lawyers, Engineers, Teachers, Designers, Accountants, Nurses, Scientists & More</p>
              </div>
            </div>
            <div className="hero-feature-card">
              <div className="feature-icon">💰</div>
              <div className="feature-content">
                <h3 className="feature-title">Competitive Earnings</h3>
                <p className="feature-text">Earn $25/h+ with flexible hours, work remotely on your schedule</p>
              </div>
            </div>
            <div className="hero-feature-card">
              <div className="feature-icon">🚀</div>
              <div className="feature-content">
                <h3 className="feature-title">Reliable & Supported</h3>
                <p className="feature-text">Backed by major investors ensuring stable payments, comprehensive training, and community support</p>
              </div>
            </div>
          </div>
          <div className="hero-cta">
            <button onClick={() => navigate('/apply')} className="btn btn-primary">Explore Jobs</button>
            <a href="#about" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-image-gallery">
          <div className="gallery-item gallery-item-large">
            <img 
              src="/hero-image-1.jpg" 
              alt="Medical professional working" 
              className="gallery-image"
            />
          </div>
          <div className="gallery-item">
            <img 
              src="/hero-image-2.jpg" 
              alt="Professional working remotely" 
              className="gallery-image"
            />
          </div>
          <div className="gallery-item">
            <img 
              src="/hero-image-3.jpg" 
              alt="Developer working on computer" 
              className="gallery-image"
            />
          </div>
          <div className="gallery-item gallery-item-wide">
            <img 
              src="/hero-image-4.jpg" 
              alt="Engineer working on blueprints" 
              className="gallery-image"
            />
          </div>
          <div className="gallery-item">
            <img 
              src="/hero-image-5.jpg" 
              alt="Professional using tablet" 
              className="gallery-image"
            />
          </div>
          <div className="gallery-item">
            <img 
              src="/hero-image-6.jpg" 
              alt="Medical professionals collaborating" 
              className="gallery-image"
            />
          </div>
          <div className="gallery-item gallery-item-tall">
            <img 
              src="/hero-image-7.jpg" 
              alt="Professional working with global connectivity" 
              className="gallery-image"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

