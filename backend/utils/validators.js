/**
 * Input validation utilities for API endpoints
 * Implements business logic validation rules
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateRole = (role) => {
  const validRoles = ['user', 'manager', 'admin'];
  return validRoles.includes(role);
};

const validateUserInput = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate) {
    if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length === 0) {
      errors.firstName = 'First name is required and must be a non-empty string';
    }

    if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
      errors.lastName = 'Last name is required and must be a non-empty string';
    }

    if (!data.email || !validateEmail(data.email)) {
      errors.email = 'Valid email is required';
    }

    if (!data.password || !validatePassword(data.password)) {
      errors.password =
        'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
    }

    if (!validateRole(data.role)) {
      errors.role = 'Invalid role provided';
    }
  } else {
    // For updates, only validate fields that are provided
    if (data.firstName !== undefined) {
      if (typeof data.firstName !== 'string' || data.firstName.trim().length === 0) {
        errors.firstName = 'First name must be a non-empty string';
      }
    }

    if (data.lastName !== undefined) {
      if (typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
        errors.lastName = 'Last name must be a non-empty string';
      }
    }

    if (data.email !== undefined) {
      if (!validateEmail(data.email)) {
        errors.email = 'Valid email is required';
      }
    }

    if (data.password !== undefined) {
      if (!validatePassword(data.password)) {
        errors.password =
          'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
      }
    }

    if (data.role !== undefined) {
      if (!validateRole(data.role)) {
        errors.role = 'Invalid role provided';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRole,
  validateUserInput,
};
