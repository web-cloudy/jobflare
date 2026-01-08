import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  updateVerificationStep,
  getUserStatus
} from '../controllers/userController.js';

const router = express.Router();

// Validation middleware
const registrationValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('profession').trim().notEmpty().withMessage('Profession is required'),
  body('education').trim().notEmpty().withMessage('Education is required'),
  body('yearsOfExperience').isInt({ min: 0 }).withMessage('Years of experience must be a positive number'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('agreeToTerms').isBoolean().equals('true').withMessage('Must agree to terms and conditions')
];

// @route   POST /api/users/register
// @desc    Register a new user and complete Step 1
// @access  Public
router.post('/register', registrationValidation, registerUser);

// @route   PUT /api/users/:userId/verification/:stepNumber
// @desc    Update verification step (Step 2 or Step 3)
// @access  Public
router.put('/:userId/verification/:stepNumber', updateVerificationStep);

// @route   GET /api/users/:userId/status
// @desc    Get user verification status
// @access  Public
router.get('/:userId/status', getUserStatus);

export default router;
