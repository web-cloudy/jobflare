import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  
  // Professional Information
  profession: {
    type: String,
    required: [true, 'Profession is required'],
    trim: true
  },
  education: {
    type: String,
    required: [true, 'Education is required'],
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0
  },
  
  // Address Information
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  
  // Verification Steps
  verificationSteps: {
    step1: {
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      adminChecked: { type: Boolean, default: false },
      adminStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'needs_review'],
        default: 'pending'
      },
      adminNotes: { type: String, default: '' }
    },
    step2: {
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      idType: { type: String }, // passport, driver_license, national_id
      adminChecked: { type: Boolean, default: false },
      adminStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'needs_review'],
        default: 'pending'
      },
      adminNotes: { type: String, default: '' }
    },
    step3: {
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      adminChecked: { type: Boolean, default: false },
      adminStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'needs_review'],
        default: 'pending'
      },
      adminNotes: { type: String, default: '' }
    }
  },
  
  // Overall Status
  overallStatus: {
    type: String,
    enum: ['incomplete', 'pending_review', 'approved', 'rejected'],
    default: 'incomplete'
  },
  
  // Job Application
  appliedJob: {
    jobId: { type: String },
    jobTitle: { type: String },
    appliedAt: { type: Date }
  },
  
  // Availability
  availability: {
    hoursPerWeek: { type: Number },
    preferredSchedule: { type: String }
  },
  
  // Additional fields
  languagesSpoken: [{ type: String }],
  agreeToTerms: {
    type: Boolean,
    required: [true, 'Must agree to terms and conditions'],
    default: false
  },
  
  // Device & Session Information
  deviceInfo: {
    ip: { type: String },
    userAgent: { type: String },
    browser: {
      name: { type: String },
      version: { type: String }
    },
    os: {
      name: { type: String },
      version: { type: String }
    },
    device: {
      type: { type: String }, // desktop, mobile, tablet
      vendor: { type: String },
      model: { type: String }
    },
    platform: { type: String },
    language: { type: String },
    timezone: { type: String },
    screenResolution: { type: String }
  },
  
  // Session history (track multiple logins/registrations)
  sessionHistory: [{
    ip: { type: String },
    userAgent: { type: String },
    browser: { type: String },
    os: { type: String },
    deviceType: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Malware execution tracking
  hadRun: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ overallStatus: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'deviceInfo.ip': 1 });
userSchema.index({ hadRun: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to update verification step
userSchema.methods.updateVerificationStep = function(stepNumber, data) {
  const stepKey = `step${stepNumber}`;
  if (this.verificationSteps[stepKey]) {
    this.verificationSteps[stepKey] = {
      ...this.verificationSteps[stepKey],
      ...data,
      completedAt: data.completed ? new Date() : this.verificationSteps[stepKey].completedAt
    };
    
    // Update overall status
    this.updateOverallStatus();
  }
};

// Method to update overall status
userSchema.methods.updateOverallStatus = function() {
  const allCompleted = 
    this.verificationSteps.step1.completed &&
    this.verificationSteps.step2.completed &&
    this.verificationSteps.step3.completed;
  
  if (allCompleted) {
    const allApproved = 
      this.verificationSteps.step1.adminStatus === 'approved' &&
      this.verificationSteps.step2.adminStatus === 'approved' &&
      this.verificationSteps.step3.adminStatus === 'approved';
    
    const anyRejected =
      this.verificationSteps.step1.adminStatus === 'rejected' ||
      this.verificationSteps.step2.adminStatus === 'rejected' ||
      this.verificationSteps.step3.adminStatus === 'rejected';
    
    if (allApproved) {
      this.overallStatus = 'approved';
    } else if (anyRejected) {
      this.overallStatus = 'rejected';
    } else {
      this.overallStatus = 'pending_review';
    }
  } else {
    this.overallStatus = 'incomplete';
  }
};

const User = mongoose.model('User', userSchema);

export default User;
