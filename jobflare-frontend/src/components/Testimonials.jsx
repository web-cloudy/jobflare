import { useState, useEffect } from 'react'
import './Testimonials.css'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Medical Doctor",
      text: "As a practicing physician, JobFlare has been an incredible source of additional income. I use my medical expertise to help train AI systems on healthcare topics, and the flexible schedule means I can work around my hospital shifts. The investor-backed platform provides excellent support, and I've been able to significantly supplement my income while contributing to AI that will help future patients."
    },
    {
      name: "James Rodriguez",
      role: "Software Developer",
      text: "Being a developer, I was already interested in AI, but JobFlare gave me a way to earn extra income while learning more about how AI systems work. The tasks are engaging, and I can work from anywhere. The additional income has been a game-changer for my family, and I love being part of making AI better for everyone."
    },
    {
      name: "Emily Thompson",
      role: "Lawyer",
      text: "As an attorney, my analytical skills are perfect for reviewing and improving AI responses on legal topics. The flexible hours allow me to work around my court schedule, and the additional income has been substantial. JobFlare's investor backing gives me confidence in the platform's stability and future growth."
    },
    {
      name: "Dr. Marcus Johnson",
      role: "Engineer",
      text: "The opportunity to earn additional income while using my engineering expertise to enhance AI capabilities has been fantastic. Whether I'm reviewing technical documentation or helping train AI on engineering concepts, the work is meaningful and well-compensated. The platform's support system is excellent, and I've recommended it to many colleagues."
    },
    {
      name: "Dr. Lisa Park",
      role: "Research Scientist",
      text: "As a research scientist, I appreciate how JobFlare allows me to apply my expertise in training AI systems while earning additional income. The platform connects me with projects that match my scientific background, and the flexible schedule fits perfectly with my research commitments. The investor backing gives me confidence in the platform's long-term viability."
    },
    {
      name: "Michael Chen",
      role: "Financial Advisor",
      text: "JobFlare has been an excellent way to supplement my income as a financial advisor. I use my expertise to help train AI on financial topics, and the work is both intellectually stimulating and financially rewarding. The platform's support is outstanding, and I've been able to earn significant additional income."
    },
    {
      name: "Dr. Rachel Green",
      role: "Veterinarian",
      text: "As a veterinarian, I love using my expertise to help train AI systems on animal care topics. JobFlare provides flexible work that fits around my clinic schedule, and the additional income has been substantial. The investor-backed platform offers great support, and I've recommended it to other veterinary professionals."
    },
    {
      name: "David Kim",
      role: "Architect",
      text: "Being an architect, I was excited to find a platform that values my design and technical expertise. JobFlare allows me to earn additional income while contributing to AI systems that will benefit the design industry. The flexible hours work perfectly with my project schedule, and the platform's support is excellent."
    }
  ]

  // Use local images for the highest quality "rich human" look
  const getAvatarUrl = (name) => {
    const nameLower = name.toLowerCase()
      .replace(/dr\.\s+/g, '') // Remove "Dr. "
      .replace(/\s+/g, '-')    // Replace spaces with hyphens
    
    // Returns path like: /images/testimonials/sarah-chen.jpg
    return `/images/testimonials/${nameLower}.jpg`
  }

  const maxIndex = testimonials.length - 1

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }


  return (
    <section className="section testimonials-section">
      <h2 className="section-title">Join a growing community</h2>
      <div className="testimonials-slider-container">
        <button className="slider-button slider-button-prev" onClick={prevSlide} aria-label="Previous">
          ‹
        </button>
        <div className="testimonials-slider-wrapper">
          <div 
            className="testimonials-slider"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)` 
            }}
          >
            {testimonials.map((testimonial, index) => {
              const isCenter = index === currentIndex
              const cardClass = isCenter ? 'testimonial-card testimonial-card-center' : 'testimonial-card testimonial-card-hidden'
              // Index 0 (1st) = left, Index 1 (2nd) = right
              const isImageLeft = index % 2 === 0
              
              return (
                <div key={index} className={cardClass}>
                  <div className={`testimonial-content-wrapper ${isImageLeft ? 'image-left' : 'image-right'}`}>
                    {isImageLeft && (
                      <div className="testimonial-image-container">
                        <img 
                          src={getAvatarUrl(testimonial.name)} 
                          alt={testimonial.name}
                          className="testimonial-image"
                          onError={(e) => {
                            // Fallback to a professional placeholder if local image fails
                            e.target.src = 'https://via.placeholder.com/1000x1000?text=Professional+Photo'
                          }}
                        />
                      </div>
                    )}
                    <div className="testimonial-text-content">
                      <p className="testimonial-text">"{testimonial.text}"</p>
                      <p className="testimonial-author">— {testimonial.name}</p>
                      <p className="testimonial-role">{testimonial.role} • JobFlare Contributor</p>
                    </div>
                    {!isImageLeft && (
                      <div className="testimonial-image-container">
                        <img 
                          src={getAvatarUrl(testimonial.name)} 
                          alt={testimonial.name}
                          className="testimonial-image"
                          onError={(e) => {
                            // Fallback to a professional placeholder if local image fails
                            e.target.src = 'https://via.placeholder.com/1000x1000?text=Professional+Photo'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <button className="slider-button slider-button-next" onClick={nextSlide} aria-label="Next">
          ›
        </button>
      </div>
      <div className="slider-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Testimonials
