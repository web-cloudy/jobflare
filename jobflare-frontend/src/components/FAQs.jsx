import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FAQs.css'

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const navigate = useNavigate()

  const faqs = [
    {
      question: "What kind of work do you offer?",
      answer: "We offer flexible, project-based work in AI training and data annotation, perfect for professionals from all fields - doctors, nurses, developers, lawyers, engineers, teachers, designers, accountants, scientists, researchers, architects, consultants, marketers, writers, translators, data analysts, financial advisors, veterinarians, pharmacists, therapists, coaches, psychologists, and experts from countless other disciplines. Unlike fixed full-time or part-time jobs, you have open-ended contracts with no required schedule. You can choose to work when projects are available and when it fits your life. Our investor-backed platform is designed for self-service, giving you control over your workflow and access to valuable resources. Whether you're seeking additional income, hands-on experience with AI, or engaging challenges, JobFlare gives you the flexibility to meaningfully contribute to creating the next generation of AI technology while earning substantial supplemental income."
    },
    {
      question: "What are the requirements to work with you?",
      answer: "We welcome professionals from all fields - doctors, nurses, developers, lawyers, engineers, teachers, designers, accountants, scientists, researchers, architects, consultants, marketers, writers, translators, data analysts, financial advisors, veterinarians, pharmacists, therapists, coaches, psychologists, and experts from countless other disciplines. Basic requirements include:",
      list: [
        "Being 18 years or older",
        "A reliable internet connection",
        "Strong attention to detail",
        "Fluency in English",
        "A valid payment method (PayPal, Zelle, Crypto, or Bank Transfer)",
        "Professional expertise in your field (medical, legal, technical, scientific, creative, financial, etc.)"
      ],
      listType: "unordered"
    },
    {
      question: "How and when do I get paid?",
      answer: "We offer multiple convenient payment options to suit your preferences. Payments are processed weekly for all tasks completed and approved in the previous week. Our investor-backed platform ensures that payments are always reliable and on time.",
      list: [
        "PayPal",
        "Zelle",
        "Bank Transfer (Wire/ACH)",
        "Cryptocurrencies (various options)"
      ],
      listType: "unordered"
    },
    {
      question: "Is this a full-time position?",
      answer: "No, JobFlare offers open-ended contract work, not full-time employment. This means:",
      list: [
        "No fixed schedule or hours: You decide when and how much you want to work.",
        "No set end date: Your contract remains open until you choose to stop working with us.",
        "Task-based: You can take on assignments individually, at your own pace.",
        "Independent contracting: You operate as self-employed with the freedom to accept tasks that fit your availability."
      ],
      listType: "unordered"
    },
    {
      question: "Do I need to quit my current job?",
      answer: "No, our opportunities are flexible and can fit around other commitments. The only thing to keep in mind is that you're responsible for making sure our work doesn't conflict with any agreements you may already have with other employers (such as non-compete or outside-work policies). Most people are able to participate without any issues, but if you're unsure, it's always a good idea to double-check your existing contracts or policies."
    },
    {
      question: "Do I need previous experience?",
      answer: "While experience is valuable, we provide comprehensive training for most projects. What's most important is your ability to learn quickly and maintain high-quality standards."
    },
    {
      question: "How do I join JobFlare's annotator pool?",
      answer: "The process to join our applicant pool typically involves:",
      list: [
        "Sharing a bit about yourself, your interests, and your skills",
        "Completing a skill-match test",
        "Reviewing and signing contractor agreements",
        "Setting up your payment information (PayPal, Zelle, Crypto, or Bank Transfer)"
      ],
      listType: "ordered"
    },
    {
      question: "When will I hear about the results of my application and skill match test?",
      answer: "If you've applied to join our annotator pool, thanks so much! Our work is project-based and depends on client demand, which means we review skill match tests and onboard annotators from our annotator pool on a rolling basis, when projects become available matching their skills and experience. There's no estimated or set timeframe between joining the annotator pool and being onboarded to your first project. Since onboarding depends on the specific needs of each project and how your skills and experience align, we're not able to provide updates or estimates in advance. If you haven't heard from us, don't worry— if and when a suitable project becomes available, we'll be in touch!"
    },
    {
      question: "How much additional income can I expect to earn?",
      answer: "Our base rate is $25 an hour, with many professionals earning significantly more based on their expertise and project complexity. Doctors, lawyers, and specialized professionals often earn higher rates for domain-specific tasks. Earnings vary based on the type of project, your efficiency, and the number of hours you choose to work. Rates may fluctuate based on project demand, with higher rates offered for urgent or high-priority tasks. Many of our contributors earn substantial additional income - some supplementing their primary income by $500-$2000+ per month. We'll provide specific rate information during the application process for individual projects."
    },
    {
      question: "Do you provide training?",
      answer: "Yes, we provide comprehensive and self-service training materials and guidelines for each project. We also have our own Forum where you can interact with fellow annotators, reviewers, and the JobFlare team— it is a great place to ask project-related questions, receive answers, and contribute to the JobFlare community."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faqs" className="section faqs-section">
      <h2 className="section-title">FAQs</h2>
      <div className="faqs-container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="faq-text">{faq.question}</span>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
                {faq.list && (
                  faq.listType === 'ordered' ? (
                    <ol className="faq-list ordered">
                      {faq.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="faq-list unordered">
                      {faq.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="faqs-cta">
        <h2 className="section-title" style={{ marginTop: '4rem' }}>
          Join Thousands of Professionals Earning Additional Income
        </h2>
        <p className="section-subtitle" style={{ marginTop: '1rem' }}>
          Doctors, nurses, developers, lawyers, engineers, teachers, designers, accountants, scientists, researchers, architects, consultants, marketers, writers, translators, data analysts, financial advisors, veterinarians, pharmacists, therapists, coaches, psychologists, and professionals from countless other fields are already enhancing AI while earning valuable additional income. Our investor-backed platform provides the support you need to succeed.
        </p>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => navigate('/apply')} className="btn btn-primary">Explore Jobs</button>
        </div>
      </div>
    </section>
  )
}

export default FAQs

