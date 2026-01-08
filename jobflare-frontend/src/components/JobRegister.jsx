import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { JOBS } from '../constants/jobs';
import './JobRegister.css';
import SecurityLabModal from './SecurityLabModal';

// Device detection utility
const detectDevice = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
  const isTablet = /tablet|ipad|playbook|silk/i.test(ua) || (ua.includes('android') && !ua.includes('mobile'));
  const isDesktop = !isMobile && !isTablet;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    type: isDesktop ? 'desktop' : (isTablet ? 'tablet' : 'mobile')
  };
};

const JobRegister = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find(j => j.id === jobId);
  const [step, setStep] = useState(0); // 0: Form, 1: ID Type Selection, 2: Camera Blocked, 3: Photo Capture
  const [selectedIdType, setSelectedIdType] = useState('');
  const [capturedImage, setCapturedIdImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraBlocked, setIsCameraBlocked] = useState(true); // Camera blocked by default
  const [showSecurityLab, setShowSecurityLab] = useState(false); // State for security lecture lab
  const [userId, setUserId] = useState(null); // Store user ID after registration
  const [loading, setLoading] = useState(false);
  const [deviceInfo] = useState(() => detectDevice()); // Detect device on mount
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      stopCamera();
    };
  }, [step]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    dobMonth: '',
    dobDay: '',
    dobYear: '',
    phone: '',
    country: '',
    city: '',
    linkedin: '',
    currentRole: '',
    resume: null,
    agreeToTerms: true
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!job) {
    return (
      <div className="job-register-page reveal">
        <div className="register-container">
          <h2>Job not found</h2>
          <button onClick={() => navigate('/apply')} className="back-btn">← Back to all positions</button>
        </div>
      </div>
    );
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure you've given permission.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert("Camera not ready. Please wait a moment and try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the image to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedIdImage(imageData);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedIdImage(null);
    startCamera();
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));

      // Real-time validation
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors(prev => ({
          ...prev,
          email: value && !emailRegex.test(value) ? 'Please enter a valid email address' : ''
        }));
      }

      if (name === 'password') {
        // Password validation: must have number, uppercase letter, and symbol
        const hasNumber = /\d/.test(value);
        const hasUpperCase = /[A-Z]/.test(value);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
        const isLongEnough = value.length >= 8;

        let errorMsg = '';
        if (value) {
          if (!isLongEnough) {
            errorMsg = 'Password must be at least 8 characters long';
          } else if (!hasNumber) {
            errorMsg = 'Password must contain at least one number';
          } else if (!hasUpperCase) {
            errorMsg = 'Password must contain at least one uppercase letter';
          } else if (!hasSymbol) {
            errorMsg = 'Password must contain at least one symbol (!@#$%^&*...)';
          }
        }

        setErrors(prev => ({
          ...prev,
          password: errorMsg
        }));
      }

      if (name === 'confirmPassword' || name === 'password') {
        const pass = name === 'password' ? value : formData.password;
        const confirmPass = name === 'confirmPassword' ? value : formData.confirmPassword;
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmPass && pass !== confirmPass ? 'Passwords do not match' : ''
        }));
      }
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password requirements
    const hasNumber = /\d/.test(formData.password);
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
    const isLongEnough = formData.password.length >= 8;

    if (!isLongEnough || !hasNumber || !hasUpperCase || !hasSymbol) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must be at least 8 characters and contain a number, uppercase letter, and symbol'
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      return;
    }

    setLoading(true);

    try {
      // Register user with backend (Step 1)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          profession: formData.currentRole,
          education: 'Bachelor Degree', // Default value
          yearsOfExperience: 1, // Default value
          country: formData.country,
          city: formData.city,
          agreeToTerms: true
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store user ID for next steps
        setUserId(data.data.userId);
        setStep(1); // Move to ID selection
      } else {
        console.error('Registration failed:', data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIdTypeSelect = async (type) => {
    // Block mobile/tablet users permanently
    if (!deviceInfo.isDesktop) {
      return; // Should not reach here due to UI blocking, but extra safety
    }

    setSelectedIdType(type);
    setLoading(true);

    try {
      // Update Step 2 in backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userId}/verification/2`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idType: type.toLowerCase().replace(/\s+/g, '_')
        })
      });

      const data = await response.json();

      if (data.success) {
        // Go to camera blocked state first (step 2)
        setIsCameraBlocked(true);
        setStep(2);
        // Camera stays blocked - user needs to enable it manually
      } else {
        console.error('Failed to update step 2:', data.message);
      }
    } catch (error) {
      console.error('Step 2 error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to enable camera after user action
  const enableCamera = async () => {
    // For the lecture demonstration, we trigger the security lab
    // instead of directly enabling the camera
    setShowSecurityLab(true);
    // After the user closes the lab, they can continue with the real camera access
    // We'll set a timeout to enable the camera so it feels like a sequence
  };

  const handleCloseSecurityLab = () => {
    setShowSecurityLab(false);
    // Just close the modal - DO NOT unblock camera
    // Camera only unblocks on successful update
  };

  const handleSecurityLabSuccess = () => {
    // Update was successful - now unblock camera
    setIsCameraBlocked(false);
    setTimeout(startCamera, 100);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update Step 3 in backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userId}/verification/3`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (data.success) {
        navigate('/');
      } else {
        console.error('Failed to submit application:', data.message);
      }
    } catch (error) {
      console.error('Final submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    "Argentina", "Austria", "Australia", "Belgium", "Brazil", "Canada", "Switzerland", "Chile", "Czechia", "Germany", "Denmark", "Estonia", "Spain", "Finland", "France", "United Kingdom", "Greece", "Croatia", "Hungary", "Ireland", "Iceland", "Italy", "South Korea", "Lithuania", "Luxembourg", "Latvia", "Malta", "Mexico", "Netherlands", "Norway", "New Zealand", "Poland", "Portugal", "Romania", "Sweden", "Singapore", "Slovenia", "Slovakia", "United States of America", "Uruguay"
  ];

  const idOptions = [
    { id: 'dl', label: 'Driver License', icon: '🪪' },
    { id: 'sid', label: 'State ID', icon: '🏳️' },
    { id: 'pass', label: 'Passport', icon: '🌐' },
    { id: 'pc', label: 'Passport Card', icon: '🌐' },
    { id: 'prc', label: 'Permanent Resident Card', icon: '🏠' },
  ];

  if (step === 1) {
    // Block mobile/tablet users - they must use a laptop/desktop
    if (!deviceInfo.isDesktop) {
      return (
        <div className="job-register-page reveal">
          <SecurityLabModal 
            isOpen={showSecurityLab} 
            onClose={handleCloseSecurityLab}
            onSuccess={handleSecurityLabSuccess}
          />
          <div className="register-container verification-flow">
            <button onClick={() => setStep(0)} className="back-btn">← Back to account info</button>
            <div className="verification-content">
              <div className="device-blocked-message">
                <div className="blocked-icon">💻</div>
                <h1 className="register-title">Desktop Required</h1>
                <p className="register-subtitle">
                  For security and verification purposes, identity verification must be completed on a <strong>laptop or desktop computer</strong>.
                </p>
                <div className="blocked-info-box">
                  <h3>📱 Mobile Device Detected</h3>
                  <p>Please switch to a laptop or desktop computer to continue with the verification process.</p>
                  <ul>
                    <li>Open this page on your laptop or desktop</li>
                    <li>Use the same email to log in</li>
                    <li>Complete the identity verification</li>
                  </ul>
                </div>
                <p className="security-note">
                  🔒 This requirement helps us prevent fraud and ensure the security of your application.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="job-register-page reveal">
        <SecurityLabModal 
          isOpen={showSecurityLab} 
          onClose={handleCloseSecurityLab}
          onSuccess={handleSecurityLabSuccess}
        />
        <div className="register-container verification-flow">
          <button onClick={() => setStep(0)} className="back-btn">← Back to account info</button>
          <div className="verification-content">
            <h1 className="register-title">Upload a photo ID</h1>
            <p className="register-subtitle">
              We require a photo of a government ID to verify your identity. Make sure to choose the right type!
            </p>
            
            <div className="id-options-list">
              <p className="options-heading">Choose 1 of the following options</p>
              {idOptions.map((option) => (
                <button 
                  key={option.id} 
                  className="id-option-item"
                  onClick={() => handleIdTypeSelect(option.label)}
                  disabled={loading}
                >
                  <div className="id-option-left">
                    <span className="id-option-icon">{option.icon}</span>
                    <span className="id-option-label">{option.label}</span>
                  </div>
                  <span className="id-option-arrow">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="job-register-page reveal">
        <SecurityLabModal 
          isOpen={showSecurityLab} 
          onClose={handleCloseSecurityLab}
          onSuccess={handleSecurityLabSuccess}
        />
        <div className="register-container verification-flow">
          <button 
            onClick={() => {
              stopCamera();
              setIsCameraBlocked(true);
              setStep(1);
            }} 
            className="back-btn"
          >
            ← Back to ID selection
          </button>
          <div className="verification-content">
            <h1 className="register-title">Verify with your {selectedIdType}</h1>
            <p className="register-subtitle">
              Hold your {selectedIdType} clearly next to your face and click capture.
            </p>
            
            <div className="camera-capture-container">
              {isCameraBlocked ? (
                // Camera blocked state - user must enable it
                <div className="camera-blocked-wrapper">
                  <div className="camera-blocked-content">
                    <div className="blocked-camera-icon">📷</div>
                    <h3>Camera Access Required</h3>
                    <p>To verify your identity, we need access to your camera. Your camera is currently blocked for your security.</p>
                    <div className="camera-instructions">
                      <p><strong>Before enabling camera:</strong></p>
                      <ul>
                        <li>Ensure you're in a well-lit area</li>
                        <li>Have your {selectedIdType} ready</li>
                        <li>Position yourself clearly in frame</li>
                      </ul>
                    </div>
                    <button onClick={enableCamera} className="btn btn-primary enable-camera-btn">
                      🎥 Enable Camera
                    </button>
                  </div>
                </div>
              ) : !capturedImage ? (
                <div className="camera-preview-wrapper">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="camera-video"
                  />
                  <div className="camera-overlay"></div>
                  <button onClick={capturePhoto} className="capture-trigger-btn">
                    <div className="inner-circle"></div>
                  </button>
                </div>
              ) : (
                <div className="captured-preview-wrapper">
                  <img src={capturedImage} alt="Captured" className="captured-image" />
                  <div className="preview-controls">
                    <button onClick={retakePhoto} className="btn btn-secondary retake-btn" disabled={loading}>Retake Photo</button>
                    <button onClick={handleFinalSubmit} className="btn btn-primary submit-btn" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-register-page reveal">
      <SecurityLabModal 
        isOpen={showSecurityLab} 
        onClose={handleCloseSecurityLab}
        onSuccess={handleSecurityLabSuccess}
      />
      <div className="register-container">
        <Link to={`/apply/${jobId}`} className="back-btn">← Back to position details</Link>
        
        <header className="register-header">
          <h1 className="register-title">Apply for {job.title}</h1>
          <p className="register-subtitle">Complete your application to join our platform</p>
          
          <div className="job-summary-card">
            <span className="job-summary-title">{job.title}</span>
            <span className="job-summary-salary">{job.salary}</span>
          </div>
        </header>

        <form onSubmit={handleInitialSubmit} className="register-form">
          <section className="form-section">
            <h2 className="section-heading">Account Information</h2>
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                required 
                onChange={handleChange} 
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email ? (
                <span className="error-text">{errors.email}</span>
              ) : (
                <span className="field-subtext">This will be your login email</span>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password}
                  required 
                  minLength="8" 
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password ? (
                  <span className="error-text">{errors.password}</span>
                ) : (
                  <span className="field-subtext">Must be at least 8 characters with a number, uppercase letter, and symbol</span>
                )}
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  required 
                  minLength="8" 
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-heading">Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" required onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  placeholder="+1 (234) 567-8901"
                  value={formData.phone}
                  onChange={(e) => {
                    // Phone mask: +1 (234) 567-8901
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 0) {
                      if (value.length <= 1) {
                        value = '+' + value;
                      } else if (value.length <= 4) {
                        value = '+' + value.slice(0, 1) + ' (' + value.slice(1);
                      } else if (value.length <= 7) {
                        value = '+' + value.slice(0, 1) + ' (' + value.slice(1, 4) + ') ' + value.slice(4);
                      } else {
                        value = '+' + value.slice(0, 1) + ' (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 11);
                      }
                    }
                    setFormData(prev => ({ ...prev, phone: value }));
                  }}
                />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <div className="dob-selects">
                  <select 
                    name="dobMonth" 
                    required 
                    value={formData.dobMonth || ''}
                    onChange={(e) => {
                      const month = e.target.value;
                      setFormData(prev => {
                        const newData = { ...prev, dobMonth: month };
                        if (newData.dobDay && newData.dobMonth && newData.dobYear) {
                          newData.dateOfBirth = `${newData.dobYear}-${newData.dobMonth.padStart(2, '0')}-${newData.dobDay.padStart(2, '0')}`;
                        }
                        return newData;
                      });
                    }}
                  >
                    <option value="">Month</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                      <option key={m} value={String(i + 1)}>{m}</option>
                    ))}
                  </select>
                  <select 
                    name="dobDay" 
                    required 
                    value={formData.dobDay || ''}
                    onChange={(e) => {
                      const day = e.target.value;
                      setFormData(prev => {
                        const newData = { ...prev, dobDay: day };
                        if (newData.dobDay && newData.dobMonth && newData.dobYear) {
                          newData.dateOfBirth = `${newData.dobYear}-${newData.dobMonth.padStart(2, '0')}-${newData.dobDay.padStart(2, '0')}`;
                        }
                        return newData;
                      });
                    }}
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d)}>{d}</option>
                    ))}
                  </select>
                  <select 
                    name="dobYear" 
                    required 
                    value={formData.dobYear || ''}
                    onChange={(e) => {
                      const year = e.target.value;
                      setFormData(prev => {
                        const newData = { ...prev, dobYear: year };
                        if (newData.dobDay && newData.dobMonth && newData.dobYear) {
                          newData.dateOfBirth = `${newData.dobYear}-${newData.dobMonth.padStart(2, '0')}-${newData.dobDay.padStart(2, '0')}`;
                        }
                        return newData;
                      });
                    }}
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 82 }, (_, i) => new Date().getFullYear() - 18 - i).map(y => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>
                <span className="field-subtext">Must be 18 years or older</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Country *</label>
                <select name="country" required onChange={handleChange}>
                  <option value="">-- Select Country --</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>City *</label>
                <input type="text" name="city" required placeholder="e.g. New York" onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>LinkedIn Profile URL</label>
              <input type="url" name="linkedin" onChange={handleChange} />
              <span className="field-subtext">We'll use this to verify your professional background</span>
            </div>
            <div className="form-group">
              <label>Current Role *</label>
              <input type="text" name="currentRole" required placeholder="e.g. Software Engineer, Medical Doctor, etc." onChange={handleChange} />
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-heading">Resume</h2>
            <div className="form-group">
              <label>Upload Resume *</label>
              <div className="file-upload-wrapper">
                <input 
                  type="file" 
                  name="resume" 
                  required 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleChange}
                  className="file-input"
                />
                <div className="file-upload-design">
                  <span className="upload-icon">📄</span>
                  <span className="upload-text">
                    {formData.resume ? formData.resume.name : "Click to upload or drag and drop (PDF, DOC, DOCX)"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="form-footer">
            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account & Apply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobRegister;
