const fs = require('fs');
const content = import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, dateOfBirth, profession, education, yearsOfExperience, country, city, address, appliedJob, availability, languagesSpoken, agreeToTerms } = req.body;

    console.log('PASSWORD RECEIVED:', password);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      firstName, lastName, email: email.toLowerCase(), password, phone, dateOfBirth, profession, education, yearsOfExperience, country, city, address, appliedJob, availability, languagesSpoken, agreeToTerms,
      verificationSteps: {
        step1: { completed: true, completedAt: new Date(), adminChecked: false, adminStatus: 'pending' },
        step2: { completed: false, adminChecked: false, adminStatus: 'pending' },
        step3: { completed: false, adminChecked: false, adminStatus: 'pending' }
      },
      overallStatus: 'incomplete'
    });

    console.log('USER SAVED WITH PASSWORD:', user.password);

    res.status(201).json({
      success: true, message: 'Registration successful! Step 1 completed.',
      data: { userId: user._id, email: user.email, fullName: user.fullName, verificationSteps: user.verificationSteps, overallStatus: user.overallStatus }
    });
  } catch (error) { next(error); }
};

export const updateVerificationStep = async (req, res, next) => {
  try {
    const { userId, stepNumber } = req.params;
    const { idType } = req.body;
    if (!['2', '3'].includes(stepNumber)) {
      return res.status(400).json({ success: false, message: 'Invalid step number.' });
    }
    const user = await User.findById(userId);
    if (!user) { return res.status(404).json({ success: false, message: 'User not found' }); }
    const stepKey = 'step' + stepNumber;
    user.verificationSteps[stepKey].completed = true;
    user.verificationSteps[stepKey].completedAt = new Date();
    if (stepNumber === '2' && idType) { user.verificationSteps[stepKey].idType = idType; }
    user.updateOverallStatus();
    await user.save();
    res.status(200).json({ success: true, message: 'Step completed!', data: { userId: user._id, verificationSteps: user.verificationSteps, overallStatus: user.overallStatus } });
  } catch (error) { next(error); }
};

export const getUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('firstName lastName email verificationSteps overallStatus createdAt');
    if (!user) { return res.status(404).json({ success: false, message: 'User not found' }); }
    res.status(200).json({ success: true, data: { userId: user._id, fullName: user.fullName, email: user.email, verificationSteps: user.verificationSteps, overallStatus: user.overallStatus, registeredAt: user.createdAt } });
  } catch (error) { next(error); }
};;

fs.writeFileSync('controllers/userController.js', content);
console.log('Done!');
