import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JOBS } from '../constants/jobs';
import './JobDetail.css';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find(j => j.id === jobId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [jobId]);

  if (!job) {
    return (
      <div className="job-detail-page reveal">
        <div className="job-detail-container">
          <h2>Job not found</h2>
          <button onClick={() => navigate('/apply')} className="back-btn">← Back to all positions</button>
        </div>
      </div>
    );
  }

  // Detailed descriptions based on job title
  const getJobDetails = (title) => {
    // Default fallback
    const defaultDetails = {
      description: "We are seeking experienced professionals to help train and evaluate AI models in their field of expertise.",
      compensationTitle: "Compensation:",
      compensation: [
        "$500 qualification bonus (received upon passing qualification)",
        `${job.salary} after passing qualification`
      ],
      responsibilities: [
        "Create high-quality domain-specific problems and solutions",
        "Review and validate AI-generated content in your field",
        "Provide detailed explanations for complex concepts",
        "Identify and fix errors in AI model outputs"
      ],
      requirements: [
        "Professional expertise or advanced degree in the relevant field",
        "Excellent written communication skills",
        "Ability to explain complex concepts clearly",
        "Strong attention to detail"
      ],
      location: "Remote from: US, UK, Canada, Asia, or European Union."
    };

    const phdMatch = title.match(/(.*) PhD \+ Python/);
    if (phdMatch) {
      const field = phdMatch[1];
      const fieldLower = field.toLowerCase();
      
      const specificResponsibilities = {
        'Physics': [
          "Create high-quality physics problems and solutions",
          "Ability to create coding problems in Physics, with solutions and evaluation tests to measure AI model performance.",
          "Review and validate AI-generated physics content",
          "Provide detailed explanations for complex physics concepts"
        ],
        'Chemistry': [
          "Develop complex chemistry reaction problems and mechanistic solutions",
          "Create coding simulations for chemical properties using Python",
          "Evaluate AI responses for chemical safety and synthesis accuracy",
          "Write detailed explanations for organic and inorganic chemistry concepts"
        ],
        'Astronomy': [
          "Formulate astrophysical problems involving stellar evolution and cosmology",
          "Develop Python scripts for celestial data analysis tasks",
          "Validate AI-generated content on planetary science and galactic dynamics",
          "Explain complex astronomical phenomena with mathematical rigor"
        ],
        'Biology': [
          "Create advanced biological problems in genetics, microbiology, and molecular biology",
          "Develop bioinformatics coding tasks using Python and relevant libraries",
          "Review AI outputs for biological accuracy and experimental design",
          "Provide in-depth explanations for complex biological systems"
        ],
        'Material Science': [
          "Design problems related to crystallography, thermodynamics, and material properties",
          "Create Python tasks for simulating material behavior and structure",
          "Verify AI-generated content on polymers, ceramics, and metallurgy",
          "Explain the relationship between microstructure and macroscopic properties"
        ]
      };

      const fieldSpecificRes = specificResponsibilities[field] || [
        `Create high-quality ${fieldLower} problems and solutions`,
        `Ability to create coding problems in ${field}, with solutions and evaluation tests to measure AI model performance.`,
        `Review and validate AI-generated ${fieldLower} content`,
        "Provide detailed explanations for complex concepts"
      ];

      return {
        ...defaultDetails,
        description: `We are seeking experienced ${field} experts to help train and evaluate AI models in ${fieldLower}-related domains.`,
        responsibilities: fieldSpecificRes,
        requirements: [
          `Doctoral degree (PhD) or current doctoral candidate in ${field}`,
          "Experience using Python in academic research or applied projects",
          "Excellent written communication skills",
          `Experience in teaching or tutoring ${fieldLower}`,
          "Ability to explain complex concepts clearly"
        ]
      };
    }

    if (title === 'Senior Software Engineer') {
      return {
        ...defaultDetails,
        description: "We are seeking experienced Software Engineers to help train and evaluate AI models in software development and system design.",
        responsibilities: [
          "Evaluate the quality of AI-generated code across multiple programming languages",
          "Create complex coding challenges and high-quality solutions",
          "Debug and improve AI-generated code snippets",
          "Provide feedback on system architecture and design patterns",
          "Write documentation and tests for code evaluation frameworks"
        ],
        requirements: [
          "Bachelors degree or higher in Computer Science or related field",
          "5+ years of professional software development experience",
          "Proficiency in multiple languages (Python, Java, C++, JavaScript, etc.)",
          "Strong understanding of algorithms and data structures",
          "Excellent technical writing skills"
        ]
      };
    }

    if (title === 'Lawyer') {
      return {
        ...defaultDetails,
        description: "We are seeking legal experts to help train and evaluate AI models in legal research, analysis, and document review.",
        responsibilities: [
          "Create and review legal documents, contracts, and research memos",
          "Evaluate AI responses to complex legal queries for accuracy and compliance",
          "Provide detailed explanations of legal principles and precedents",
          "Help establish safety guidelines for AI in legal contexts",
          "Analyze case law to verify AI-generated legal citations"
        ],
        requirements: [
          "JD or equivalent professional legal degree",
          "Active bar membership or significant professional legal experience",
          "Exceptional analytical and writing skills",
          "Ability to explain complex legal concepts to non-experts",
          "High attention to detail and ethical standards"
        ]
      };
    }

    if (title.includes('Medical')) {
      return {
        ...defaultDetails,
        description: "We are seeking medical professionals to help train and evaluate AI models in clinical reasoning, diagnostics, and medical documentation.",
        responsibilities: [
          "Develop and review complex clinical case studies",
          "Evaluate AI-generated medical advice and documentation for accuracy",
          "Provide clear explanations for diagnostic decisions and treatment plans",
          "Ensure AI models adhere to medical standards and ethics",
          "Review medical coding and billing logic for accuracy"
        ],
        requirements: [
          "MD, DO, or equivalent medical degree",
          "Active medical license or significant clinical experience",
          "Strong understanding of medical terminology and pathology",
          "Excellent written communication skills",
          "Commitment to medical accuracy and patient safety"
        ]
      };
    }

    if (title === 'Generalist' || title === 'Data Annotation Specialist') {
      return {
        ...defaultDetails,
        description: "The Generalist role is ideal for individuals with a broad range of skills and interests, offering opportunities to work on diverse projects and develop expertise in multiple areas.",
        compensationTitle: "Compensation:",
        compensation: [
          `${job.salary} for completed and approved tasks`,
          "Flexible weekly payments"
        ],
        responsibilities: [
          "Review AI-generated text for factual accuracy and coherence",
          "Rank multiple AI responses based on quality and safety",
          "Write high-quality prompts and desired model responses",
          "Label data for various machine learning projects",
          "Identify and report biases in AI model outputs"
        ],
        requirements: [
          "Strong command of the English language",
          "Excellent research and fact-checking skills",
          "High attention to detail",
          "Ability to follow complex instructions and guidelines",
          "Reliable internet connection and computer"
        ]
      };
    }

    if (title.includes('Creative Writer')) {
      return {
        ...defaultDetails,
        description: "We are seeking talented writers to help train AI models in creative writing, storytelling, and content strategy.",
        responsibilities: [
          "Generate high-quality creative content (stories, poems, scripts, articles)",
          "Review and improve AI-generated creative writing",
          "Develop complex writing prompts to test model capabilities",
          "Provide feedback on tone, style, and narrative flow",
          "Create style guides for consistent AI personality generation"
        ],
        requirements: [
          "Degree in English, Creative Writing, Journalism, or related field",
          "Proven portfolio of creative or professional writing",
          "Exceptional grasp of grammar, style, and voice",
          "Ability to write across different genres and formats",
          "Strong editing and proofreading skills"
        ]
      };
    }

    if (title.includes('Financial Advisor')) {
      return {
        ...defaultDetails,
        description: "We are seeking financial experts to help train and evaluate AI models in financial planning, accounting, and tax analysis.",
        responsibilities: [
          "Develop and review financial analysis reports and case studies",
          "Evaluate AI responses to complex financial and tax queries",
          "Provide detailed explanations of financial regulations and accounting standards",
          "Verify the accuracy of financial calculations performed by AI models",
          "Research and document tax law changes for model updating"
        ],
        requirements: [
          "Degree in Finance, Accounting, Economics, or related field",
          "CPA, CFA, or equivalent professional certification preferred",
          "Strong understanding of financial markets and regulations",
          "Excellent analytical and quantitative skills",
          "Clear and concise technical writing ability"
        ]
      };
    }

    if (title.includes('Architectural')) {
      return {
        ...defaultDetails,
        description: "We are seeking architecture and design experts to help train and evaluate AI models in urban planning, structural design, and architectural theory.",
        responsibilities: [
          "Review and provide feedback on AI-generated architectural designs and plans",
          "Create complex design challenges and evaluation criteria",
          "Explain architectural principles, building codes, and material science",
          "Develop high-quality 2D and 3D design tasks for model training",
          "Assess AI-generated structural integrity reports"
        ],
        requirements: [
          "Degree in Architecture, Interior Design, or Urban Planning",
          "Professional licensure or significant project experience",
          "Proficiency in design software (CAD, BIM, Rhino, etc.)",
          "Excellent spatial reasoning and technical writing skills",
          "Knowledge of building codes and sustainable design practices"
        ]
      };
    }

    if (title.includes('Data Analyst')) {
      return {
        ...defaultDetails,
        description: "We are seeking data experts to help train and evaluate AI models in data analysis, statistical modeling, and data visualization.",
        responsibilities: [
          "Perform complex data analysis tasks and verify AI-generated insights",
          "Create datasets and visualization prompts for model testing",
          "Explain statistical concepts and data-driven decision-making processes",
          "Identify errors in AI model's quantitative reasoning and data interpretation",
          "Develop Python scripts for advanced data manipulation and analysis"
        ],
        requirements: [
          "Degree in Data Science, Statistics, Mathematics, or related field",
          "Proficiency in SQL and Python (Pandas, NumPy, etc.)",
          "Experience with data visualization tools (Tableau, PowerBI, Matplotlib)",
          "Excellent analytical and problem-solving skills",
          "Strong technical writing and communication abilities"
        ]
      };
    }

    if (title.includes('Veterinarian')) {
      return {
        ...defaultDetails,
        description: "We are seeking veterinary professionals to help train and evaluate AI models in animal health, diagnostics, and pharmaceutical care for animals.",
        responsibilities: [
          "Review and develop clinical cases for various animal species",
          "Evaluate AI-generated veterinary advice for medical accuracy",
          "Explain complex animal anatomy, pathology, and treatment protocols",
          "Verify dosages and medical interactions for veterinary pharmaceuticals",
          "Ensure AI models adhere to veterinary ethical standards and best practices"
        ],
        requirements: [
          "DVM, VMD, or equivalent veterinary medical degree",
          "Active veterinary license or significant clinical experience",
          "Specialized knowledge in small animal, large animal, or exotic medicine",
          "Excellent written communication skills",
          "Commitment to animal welfare and medical precision"
        ]
      };
    }

    if (title.includes('Pharmacist')) {
      return {
        ...defaultDetails,
        description: "We are seeking pharmaceutical experts to help train and evaluate AI models in pharmacology, drug interactions, and clinical pharmacy.",
        responsibilities: [
          "Validate AI-generated information on drug mechanisms and side effects",
          "Review complex prescription scenarios for potential interactions",
          "Explain pharmacological principles and therapeutic classifications",
          "Verify accurate pharmaceutical calculations and dosing guidelines",
          "Develop safety protocols for AI in pharmaceutical consultation contexts"
        ],
        requirements: [
          "PharmD or equivalent professional degree in Pharmacy",
          "Active pharmacy license or significant pharmaceutical research experience",
          "Strong understanding of clinical pharmacology and drug regulations",
          "Exceptional attention to detail and medical accuracy",
          "Clear and concise professional writing ability"
        ]
      };
    }

    if (title.includes('Psychologist') || title.includes('Therapist')) {
      return {
        ...defaultDetails,
        description: "We are seeking mental health professionals to help train and evaluate AI models in psychology, behavioral science, and therapeutic communication.",
        responsibilities: [
          "Evaluate AI responses for therapeutic tone, empathy, and ethical safety",
          "Develop scenarios for testing AI understanding of psychological principles",
          "Provide feedback on behavioral health content and interventions",
          "Explain complex psychological theories and clinical frameworks",
          "Establish safety boundaries for AI in mental health-related tasks"
        ],
        requirements: [
          "PhD, PsyD, or Master's degree in Psychology, Counseling, or Social Work",
          "Professional licensure or significant clinical/research experience",
          "Deep understanding of behavioral health and therapeutic ethics",
          "Excellent communication and empathetic writing skills",
          "High degree of professional discretion and judgment"
        ]
      };
    }

    if (title.includes('Marketing')) {
      return {
        ...defaultDetails,
        description: "We are seeking marketing professionals to help train and evaluate AI models in brand strategy, consumer behavior, and digital marketing.",
        responsibilities: [
          "Develop and review marketing campaigns and strategic plans",
          "Evaluate AI-generated marketing copy for brand voice and effectiveness",
          "Explain marketing frameworks, consumer psychology, and market trends",
          "Create complex marketing prompts to test model creativity and logic",
          "Provide feedback on SEO, SEM, and social media strategy tasks"
        ],
        requirements: [
          "Degree in Marketing, Communications, Business, or related field",
          "Proven track record in brand strategy or digital marketing",
          "Exceptional understanding of market dynamics and consumer behavior",
          "Strong creative and analytical writing skills",
          "Proficiency in marketing analytics and strategic planning"
        ]
      };
    }

    if (title.includes('Translator') || title.includes('Linguist')) {
      return {
        ...defaultDetails,
        description: "We are seeking language experts to help train and evaluate AI models in translation, localization, and computational linguistics.",
        responsibilities: [
          "Review and improve AI-generated translations for nuance and cultural accuracy",
          "Develop complex linguistic prompts to test model's semantic understanding",
          "Provide feedback on syntax, grammar, and idiomatic expressions",
          "Evaluate AI performance in multi-language and specialized domain translation",
          "Create style guides for high-quality localization and translation"
        ],
        requirements: [
          "Degree in Linguistics, Translation, or a specific Language/Literature",
          "Native or near-native fluency in multiple languages",
          "Proven experience in professional translation or localization",
          "Deep understanding of linguistic theory and cultural nuances",
          "Exceptional written communication and proofreading skills"
        ]
      };
    }

    if (title.includes('Educational') || title.includes('Teacher')) {
      return {
        ...defaultDetails,
        description: "We are seeking education professionals to help train and evaluate AI models in pedagogy, curriculum development, and educational research.",
        responsibilities: [
          "Create and review high-quality educational materials and assessments",
          "Evaluate AI responses to student queries across various grade levels",
          "Provide feedback on pedagogical methods and instructional design",
          "Develop clear and effective learning paths for complex topics",
          "Review and tag educational content for alignment with learning standards"
        ],
        requirements: [
          "Degree in Education, Academic Research, or a specific subject area",
          "Teaching experience at the K-12 or university level",
          "Strong understanding of learning theories and instructional design",
          "Excellent communication and presentation skills",
          "Ability to simplify complex concepts for different audiences"
        ]
      };
    }

    return defaultDetails;
  };

  const details = getJobDetails(job.title);

  return (
    <div className="job-detail-page reveal">
      <div className="job-detail-container">
        <button onClick={() => navigate('/apply')} className="back-btn">← Back to all positions</button>
        
        <header className="job-header">
          <h1 className="job-title">{job.title}</h1>
          <div className="job-meta">
            <div className="meta-item">
              <span className="meta-label">Hourly Rate</span>
              <span className="meta-value">{job.salary}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Posted Date</span>
              <span className="meta-value">{job.date}</span>
            </div>
          </div>
        </header>

        <section className="job-section">
          <p className="job-description">{details.description}</p>
          <p>This position requires:</p>
          <ul className="job-list">
            {details.requirements.slice(0, 2).map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
          <p>In this role, you will contribute to advancing AI research by creating challenging problems in your field of expertise.</p>
        </section>

        <section className="job-section">
          <h3>{details.compensationTitle}</h3>
          <ul className="job-list">
            {details.compensation.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <hr className="job-divider" />

        <section className="job-section">
          <h3>Responsibilities</h3>
          <ul className="job-list">
            {details.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="job-section">
          <h3>Requirements</h3>
          <ul className="job-list">
            {details.requirements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="job-section">
          <h3>Location</h3>
          <p>{details.location}</p>
        </section>

        <div className="job-apply-cta">
          <button 
            className="btn btn-primary apply-btn"
            onClick={() => navigate(`/apply/${jobId}/register`)}
          >
            Apply for this Position
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
