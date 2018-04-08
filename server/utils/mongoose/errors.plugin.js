/* eslint no-param-reassign: 0 */

const fixError = (error, _, next) => {
  error.message = Object.values(error.errors)
    .map(err => err.message)
    .join(' ');
  next(error);
};

const modifyErrors = (schema) => {
  schema.post('validate', (error, _, next) => {
    // CastError fix
    Object.values(error.errors)
      .filter(err => err.name === 'CastError')
      .forEach((err) => {
        err.message = 'Невалиден тип данни.';
      });

    next(error);
  });

  schema.post('validate', fixError);
  schema.post('save', fixError);
  schema.post('update', fixError);
  schema.post('findOneAndUpdate', fixError);
};

module.exports = { modifyErrors };
