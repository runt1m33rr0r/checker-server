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
}

module.exports = BaseModel;
