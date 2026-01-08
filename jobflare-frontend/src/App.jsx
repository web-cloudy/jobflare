import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Benefits from './components/Benefits'
import Tasks from './components/Tasks'
import HowItWorks from './components/HowItWorks'
import FAQs from './components/FAQs'
import Footer from './components/Footer'
import Terms from './components/Terms'
import Privacy from './components/Privacy'
import Cookies from './components/Cookies'
import ExploreJobs from './components/ExploreJobs'
import JobDetail from './components/JobDetail'
import JobRegister from './components/JobRegister'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'light'
  })

  const [activePolicy, setActivePolicy] = useState(null)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal')
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll('.section, .hero, .explore-jobs-page, .job-detail-page, .job-register-page')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [pathname])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <div className="app">
      {!isAdminRoute && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <About />
            <Testimonials />
            <Benefits />
            <Tasks />
            <HowItWorks />
            <FAQs />
          </>
        } />
        <Route path="/apply" element={<ExploreJobs />} />
        <Route path="/apply/:jobId" element={<JobDetail />} />
        <Route path="/apply/:jobId/register" element={<JobRegister />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {!isAdminRoute && <Footer onPolicyClick={setActivePolicy} />}

      {activePolicy === 'terms' && <Terms onClose={() => setActivePolicy(null)} />}
      {activePolicy === 'privacy' && <Privacy onClose={() => setActivePolicy(null)} />}
      {activePolicy === 'cookies' && <Cookies onClose={() => setActivePolicy(null)} />}
    </div>
  )
}

export default App
