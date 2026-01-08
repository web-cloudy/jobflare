import './Benefits.css'

const Benefits = () => {
  const benefits = [
    {
      icon: "🏠",
      title: "Work from home",
      description: "Work from the comfort of your home."
    },
    {
      icon: "⏰",
      title: "Flexible work hours",
      description: "Work any hours that are convenient for you."
    },
    {
      icon: "🎯",
      title: "Diverse tasks",
      description: "Choose from a set of tasks that match your skills and interests."
    },
    {
      icon: "📚",
      title: "No previous experience needed",
      description: "No previous experience is needed with AI, you can learn as you go."
    },
    {
      icon: "💼",
      title: "Work as much as you want",
      description: "Work any number of hours, whether it's just a few hours a week or much more."
    },
    {
      icon: "💰",
      title: "Earn Additional Income",
      description: "Supplement your primary income with competitive rates starting at $25/hour. Get paid weekly via PayPal, Zelle, Crypto, or Bank Transfer."
    },
    {
      icon: "🚀",
      title: "Reliable Platform with Support",
      description: "Backed by major investors ensuring stable payments, comprehensive training materials, community forum, and dedicated support team to help you succeed."
    }
  ]

  return (
    <section id="benefits" className="section benefits-section">
      <h2 className="section-title">Benefits</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-card">
            <div className="benefit-icon">{benefit.icon}</div>
            <h3 className="benefit-title">{benefit.title}</h3>
            <p className="benefit-description">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Benefits

