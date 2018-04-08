const modifyErrors = (schema) => {
  schema.post('validate', (error, doc, next) => {
    /* eslint no-param-reassign: 0 */
    error.message = Object.values(error.errors).join(' ');
    next(error);
  });
};

module.exports = { modifyErrors };
