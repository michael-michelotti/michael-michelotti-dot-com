const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.updateOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) return next(new AppError('No document found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
};

exports.createOne = (Model) => async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
};

exports.getAll = (Model) => async (req, res, next) => {
  let filter = {};

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc,
    },
  });
};
