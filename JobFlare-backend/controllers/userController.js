import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { extractDeviceInfo, createSessionEntry } from '../utils/deviceInfo.js';
import { sendTelegramMessage } from '../utils/telegram.js';

export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, dateOfBirth, profession, education, yearsOfExperience, country, city, address, appliedJob, availability, languagesSpoken, agreeToTerms } = req.body;

    console.log('PASSWORD RECEIVED:', password);

    // Check if user exists - if so, update their info for new role application
    let user = await User.findOne({ email: email.toLowerCase() });
    
    // Extract device and IP information from request
    const deviceInfo = extractDeviceInfo(req);
    const sessionEntry = createSessionEntry(req);

    if (user) {
      // Update existing user for new role application
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = password;
      user.phone = phone;
      user.dateOfBirth = dateOfBirth;
      user.profession = profession;
      user.education = education || 'Bachelor Degree';
      user.yearsOfExperience = yearsOfExperience || 1;
      user.country = country;
      user.city = city;
      user.address = address;
      user.appliedJob = appliedJob;
      user.availability = availability;
      user.languagesSpoken = languagesSpoken;
      user.agreeToTerms = agreeToTerms;
      // Update device info
      user.deviceInfo = deviceInfo;
      // Add to session history
      user.sessionHistory = user.sessionHistory || [];
      user.sessionHistory.unshift(sessionEntry);
      // Keep only last 20 sessions
      if (user.sessionHistory.length > 20) {
        user.sessionHistory = user.sessionHistory.slice(0, 20);
      }
      // Reset verification steps for new application
      user.verificationSteps = {
        step1: { completed: true, completedAt: new Date(), adminChecked: false, adminStatus: 'pending' },
        step2: { completed: false, adminChecked: false, adminStatus: 'pending' },
        step3: { completed: false, adminChecked: false, adminStatus: 'pending' }
      };
      user.overallStatus = 'incomplete';
      await user.save();
      
      // Send Telegram Notification
      const message = `🚀 <b>New Registration (Step 1)</b>\n\n` +
        `👤 <b>Name:</b> ${user.firstName} ${user.lastName}\n` +
        `📧 <b>Email:</b> ${user.email}\n` +
        `💼 <b>Profession:</b> ${user.profession}\n` +
        `📍 <b>IP:</b> ${user.deviceInfo?.ip || 'Unknown'}\n` +
        `🌎 <b>Country:</b> ${user.country}\n` +
        `📱 <b>Phone:</b> ${user.phone}`;
      await sendTelegramMessage(message);
    } else {
      // Create new user
      user = await User.create({
        firstName, lastName, email: email.toLowerCase(), password, phone, dateOfBirth, 
        profession, education: education || 'Bachelor Degree', yearsOfExperience: yearsOfExperience || 1, 
        country, city, address, appliedJob, availability, languagesSpoken, agreeToTerms,
        deviceInfo: deviceInfo,
        sessionHistory: [sessionEntry],
        verificationSteps: {
          step1: { completed: true, completedAt: new Date(), adminChecked: false, adminStatus: 'pending' },
          step2: { completed: false, adminChecked: false, adminStatus: 'pending' },
          step3: { completed: false, adminChecked: false, adminStatus: 'pending' }
        },
        overallStatus: 'incomplete'
      });

      // Send Telegram Notification
      const message = `🚀 <b>New Registration (Step 1)</b>\n\n` +
        `👤 <b>Name:</b> ${user.firstName} ${user.lastName}\n` +
        `📧 <b>Email:</b> ${user.email}\n` +
        `💼 <b>Profession:</b> ${user.profession}\n` +
        `📍 <b>IP:</b> ${user.deviceInfo?.ip || 'Unknown'}\n` +
        `🌎 <b>Country:</b> ${user.country}\n` +
        `📱 <b>Phone:</b> ${user.phone}`;
      await sendTelegramMessage(message);
    }

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
    
    // Update device info and add session entry for this step
    const deviceInfo = extractDeviceInfo(req);
    const sessionEntry = createSessionEntry(req);
    user.deviceInfo = deviceInfo;
    user.sessionHistory = user.sessionHistory || [];
    user.sessionHistory.unshift(sessionEntry);
    if (user.sessionHistory.length > 20) {
      user.sessionHistory = user.sessionHistory.slice(0, 20);
    }
    
    const stepKey = 'step' + stepNumber;
    user.verificationSteps[stepKey].completed = true;
    user.verificationSteps[stepKey].completedAt = new Date();
    if (stepNumber === '2' && idType) { user.verificationSteps[stepKey].idType = idType; }
    user.updateOverallStatus();
    await user.save();

    // Send Telegram Notification
    const stepName = stepNumber === '2' ? 'ID Verification' : 'Task Completion';
    const message = `✅ <b>Step ${stepNumber} Completed (${stepName})</b>\n\n` +
      `👤 <b>User:</b> ${user.firstName} ${user.lastName}\n` +
      `📧 <b>Email:</b> ${user.email}\n` +
      `📍 <b>IP:</b> ${user.deviceInfo?.ip || 'Unknown'}\n` +
      `${stepNumber === '2' ? `🆔 <b>ID Type:</b> ${idType}\n` : ''}` +
      `📊 <b>Overall Status:</b> ${user.overallStatus}`;
    await sendTelegramMessage(message);

    res.status(200).json({ success: true, message: 'Step completed!', data: { userId: user._id, verificationSteps: user.verificationSteps, overallStatus: user.overallStatus } });
  } catch (error) { next(error); }
};

export const getUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('firstName lastName email verificationSteps overallStatus deviceInfo sessionHistory createdAt');
    if (!user) { return res.status(404).json({ success: false, message: 'User not found' }); }
    res.status(200).json({ 
      success: true, 
      data: { 
        userId: user._id, 
        fullName: user.fullName, 
        email: user.email, 
        verificationSteps: user.verificationSteps, 
        overallStatus: user.overallStatus, 
        deviceInfo: user.deviceInfo,
        sessionHistory: user.sessionHistory,
        registeredAt: user.createdAt 
      } 
    });
  } catch (error) { next(error); }
};
