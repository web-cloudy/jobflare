import './HowItWorks.css'

const HowItWorks = () => {
  const steps = [
    {
      icon: "🎯",
      title: "Do the skill match test to get the best-suited projects",
      label: "Skills match test"
    },
    {
      icon: "⏰",
      title: "Complete tasks when it suits you, where it suits you",
      label: "Complete tasks on own your schedule"
    },
    {
      icon: "💵",
      title: "Earn additional income with competitive weekly payments",
      label: "Get paid weekly via PayPal, Zelle, Crypto, or Bank Transfer"
    }
  ]

  return (
    <section id="how-it-works" className="section how-it-works-section">
      <h2 className="section-title">Start Earning Additional Income Today</h2>
      <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
        Perfect for doctors, nurses, developers, lawyers, engineers, teachers, designers, accountants, scientists, researchers, architects, consultants, marketers, writers, translators, data analysts, financial advisors, veterinarians, pharmacists, therapists, coaches, psychologists, and professionals from all fields seeking flexible additional income.
      </p>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div className="step-number">{index + 1}</div>
            <div className="step-icon">{step.icon}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-label">{step.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks

