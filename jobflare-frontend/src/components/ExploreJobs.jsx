import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { JOBS } from '../constants/jobs';
import './ExploreJobs.css';

const ExploreJobs = () => {
  const navigate = useNavigate();

  return (
    <div className="explore-jobs-page reveal">
      <div className="explore-container">
        <header className="explore-header">
          <button onClick={() => navigate('/')} className="back-btn">← Back to Home</button>
          <h1 className="section-title">Discover Available Positions</h1>
          <p className="section-subtitle">
            Find the perfect role that matches your skills and aspirations. Earn additional income while shaping the future of AI.
          </p>
        </header>

        <div className="jobs-grid">
          {JOBS.map((job) => (
            <Link key={job.id} to={`/apply/${job.id}`} className="job-card-link">
              <div className="job-card">
                <div className="job-card-header">
                  <div className="job-tags">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="job-tag">{tag}</span>
                    ))}
                  </div>
                  <span className="posted-date">{job.date}</span>
                </div>
                <div className="job-card-body">
                  <h3 className="job-card-title">{job.title}</h3>
                  <p className="job-card-salary">{job.salary}</p>
                </div>
                <div className="job-card-footer">
                  <span className="view-details-btn">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="signin-prompt">
          <p>Already a member? <a href="#signin" className="signin-link">Sign in now</a></p>
        </div>
      </div>
    </div>
  );
};

export default ExploreJobs;
