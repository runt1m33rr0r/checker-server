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

  if (minLen && input.length < minLen) {
    throw new Error(errorMessage);
  }

  if (maxLen && input.length > maxLen) {
    throw new Error(errorMessage);
  }
};

const validateNumber = ({
  input, errorMessage, min = null, max = null,
}) => {
  if (typeof input !== 'number') {
    throw new Error(errorMessage);
  }

  if (min && input.length < min) {
    throw new Error(errorMessage);
  }

  if (max && input.length > max) {
    throw new Error(errorMessage);
  }
};

const validateArray = ({
  input, errorMessage, contentType = null, acceptableValues = [],
}) => {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error(errorMessage);
  }

  if (contentType === null && acceptableValues.length === 0) {
    return;
  }

  /* eslint valid-typeof: 0 */
  input.forEach((el) => {
    if (
      (contentType && typeof el !== contentType) ||
      (acceptableValues.length > 0 && !acceptableValues.includes(el))
    ) {
      throw new Error(errorMessage);
    }
  });
};

module.exports = { validateString, validateNumber, validateArray };
