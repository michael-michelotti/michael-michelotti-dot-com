/**
 * A decorator which takes an async function and returns the same function wrapped in a try clause
 * with a catch clause which sends the error to the global error handler
 * @function
 * @name catchAsync
 * @param {Function} fn function to be wrapped in a try clause
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
