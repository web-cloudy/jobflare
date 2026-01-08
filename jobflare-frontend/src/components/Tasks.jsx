import './Tasks.css'

const Tasks = () => {
  const tasks = [
    {
      title: "Select which AI chatbot answer is the best",
      description: "In this task you will be asked to write a question for an AI chatbot on a topic you are familiar with. You will then get two different answers and you will need to judge which of the two is better. You'll have to look at various aspects of the answers, such as truthfulness, relevancy, tone and length."
    },
    {
      title: "Correct answers from AI chatbots in your field",
      description: "In this task you will be asked to write a question for a chatbot on a topic you are an expert on. The chatbot will then produce an answer, and your task is to both grade but also fix the answer. You will need to do a detailed fact check, add any missing information and fix overall structure and tone."
    },
    {
      title: "Demonstrate how to do online research for a topic",
      description: "In this task you will be demonstrating the steps needed to do an online research on a specific topic. You will be asked to come up with an online research topic and then capture all the steps you take to do this research."
    }
  ]

  return (
    <section className="section tasks-section">
      <h2 className="section-title">Work Opportunities for Experts from All Fields</h2>
      <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
        Whether you're a doctor, nurse, developer, lawyer, engineer, teacher, designer, accountant, scientist, researcher, architect, consultant, marketer, writer, translator, data analyst, financial advisor, veterinarian, pharmacist, therapist, coach, psychologist, or professional from any other field, your expertise is valuable in training AI systems. We welcome experts from healthcare, technology, law, education, finance, creative arts, sciences, and all specialized disciplines.
      </p>
      <div className="tasks-grid">
        {tasks.map((task, index) => (
          <div key={index} className="task-card">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-description">{task.description}</p>
          </div>
        ))}
      </div>
      <div className="tasks-cta">
        <h2 className="section-title" style={{ marginTop: '4rem' }}>
          Make AI Part of Your Life While Earning Additional Income
        </h2>
        <p className="section-subtitle">
          Join thousands of professionals from diverse fields - doctors, nurses, developers, lawyers, engineers, teachers, designers, accountants, scientists, researchers, architects, consultants, marketers, writers, translators, data analysts, financial advisors, veterinarians, pharmacists, therapists, coaches, psychologists, and experts from countless other disciplines - who are enhancing AI's capabilities while earning valuable additional income. Our investor-backed platform provides the support you need to succeed.
        </p>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="#explore" className="btn btn-primary">Explore Jobs</a>
        </div>
      </div>
    </section>
  )
}

export default Tasks

