const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .isLength({ min: 3, max: 60 })
    .withMessage('Name must be between 3 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
    .notEmpty()
    .withMessage('Address is required'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Password update validation
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('New password must contain at least one uppercase letter and one special character'),
  handleValidationErrors
];

// Store validation rules
const validateStore = [
  body('name')
    .isLength({ min: 3, max: 60 })
    .withMessage('Store name must be between 3 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
    .notEmpty()
    .withMessage('Address is required'),
  handleValidationErrors
];

// Rating validation
const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('storeId')
    .notEmpty()
    .withMessage('Valid store ID is required'),
  handleValidationErrors
];

// Admin user creation validation
const validateAdminUserCreation = [
  body('name')
    .isLength({ min: 3, max: 60 })
    .withMessage('Name must be between 3 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
    .notEmpty()
    .withMessage('Address is required'),
  body('role')
    .isIn(['system_admin', 'normal_user', 'store_owner'])
    .withMessage('Role must be system_admin, normal_user, or store_owner'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordUpdate,
  validateStore,
  validateRating,
  validateAdminUserCreation,
  handleValidationErrors
};
