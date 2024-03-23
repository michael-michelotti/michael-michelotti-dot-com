const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');

exports.protect = catchAsync(async (req, res, next) => {
  let pwHash;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    pwHash = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    pwHash = req.cookies.token;
  }

  if (!pwHash) {
    return next(
      new AppError('You are not authorized to access this route.', 403)
    );
  }

  const verified = await bcrypt.compare(process.env.AUTH_PASSWORD, pwHash);

  if (!verified) return next(new AppError('Unable to authenticate.', 401));

  next();
});
