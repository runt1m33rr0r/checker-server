const validateString = ({
  input,
  errorMessage,
  checkUppercase = false,
  checkLowerCase = false,
  minLen = null,
  maxLen = null,
}) => {
  if (typeof input !== 'string') {
    throw new Error(errorMessage);
  }

  if (checkUppercase && input !== input.toUpperCase()) {
    throw new Error(errorMessage);
  }

  if (checkLowerCase && input !== input.toLowerCase()) {
    throw new Error(errorMessage);
  }

  if (minLen !== null && input.length < minLen) {
    throw new Error(errorMessage);
  }

  if (maxLen !== null && input.length > maxLen) {
    throw new Error(errorMessage);
  }
};

const validateNumber = ({
  input, errorMessage, min = null, max = null,
}) => {
  if (typeof input !== 'number') {
    throw new Error(errorMessage);
  }

  if (min !== null && input.length < min) {
    throw new Error(errorMessage);
  }

  if (max !== null && input.length > max) {
    throw new Error(errorMessage);
  }
};

const validateArray = ({ input, errorMessage }) => {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error(errorMessage);
  }
};

const validateStrArray = ({
  input,
  errorMessage,
  acceptableValues = [],
  checkUppercase = false,
  checkLowerCase = false,
  minLen = null,
  maxLen = null,
}) => {
  validateArray({ input, errorMessage });

  input.forEach((el) => {
    validateString({
      input: el,
      errorMessage,
      minLen,
      maxLen,
      checkUppercase,
      checkLowerCase,
    });

    if (acceptableValues.length > 0 && !acceptableValues.includes(el)) {
      throw new Error(errorMessage);
    }
  });
};

const validateBool = ({ input, errorMessage, expectedValue = null }) => {
  if (typeof input !== 'boolean') {
    throw new Error(errorMessage);
  }

  if (expectedValue !== null && input !== expectedValue) {
    throw new Error(errorMessage);
  }
};

const validateObject = ({ input, errorMessage }) => {
  if (typeof input !== 'object') {
    throw new Error(errorMessage);
  }
};

module.exports = {
  validateString,
  validateNumber,
  validateStrArray,
  validateArray,
  validateBool,
  validateObject,
};
