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
  // let filter = {};
  // if (req.params.productId) filter = { product: req.params.productId };

  // const features = new APIFeatures(Model.find(filter), req.query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  // const doc = await features.query;

  // // SEND RESPONSE
  // res.status(200).json({
  //   status: 'success',
  //   results: doc.length,
  //   data: {
  //     data: doc,
  //   },
  // });
  res.status(200).json({
    status: 'project created',
  });
};
