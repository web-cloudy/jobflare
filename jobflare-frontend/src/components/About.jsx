import './About.css'

import { useNavigate } from 'react-router-dom'
import './About.css'

const About = () => {
  const navigate = useNavigate()
  return (
    <section id="about" className="section about-section">
      <div className="about-content">
        <h2 className="section-title">
          For Employers & Freelancers: Join Thousands of Professionals Enhancing AI
        </h2>
        <p className="section-subtitle">
          <strong>For Freelancers & Professionals:</strong> JobFlare.ai welcomes experts from all fields including doctors, nurses, developers, lawyers, engineers, teachers, designers, accountants, scientists, researchers, architects, consultants, marketers, writers, translators, data analysts, financial advisors, veterinarians, pharmacists, therapists, coaches, psychologists, researchers, and professionals from countless other disciplines. Whether you're in healthcare, technology, law, education, finance, creative arts, or any specialized field, our platform offers you the opportunity to earn substantial additional income while making AI smarter and more capable. Our investor-backed platform provides valuable support to enhance your life through flexible, meaningful work.
          <br /><br />
          <strong>For Employers:</strong> Access a diverse pool of highly skilled professionals from medical, legal, technical, scientific, creative, financial, educational, and countless other fields. Our platform connects you with experts who can help train and improve your AI systems while providing them with valuable additional income opportunities. Join our investor-backed network and enhance your AI capabilities with real-world expertise from professionals across all industries.
        </p>
        <div className="about-cta">
          <button onClick={() => navigate('/apply')} className="btn btn-primary">Explore Jobs</button>
        </div>
      </div>
    </section>
  )
}

export default About

