class BaseModel {
  static toViewModel(model) {
    const viewModel = {};

    Object.keys(model).forEach((prop) => {
      viewModel[prop] = model[prop];
    });

    delete viewModel._id;
    viewModel.id = model._id;

    return viewModel;
  }

  static getIndexes() {
    return {};
  }

  static async validate(model) {
    if (!model) {
      return Promise.reject(new Error('Invalid!'));
    }
    return Promise.resolve('Valid!');
  }
}

module.exports = BaseModel;
