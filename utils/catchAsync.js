// Function that returns an anonymous function that calls the function passed in initially (fn)
// Since it's an async function, it returns a promise, which if rejected, we can catch with the .catch() and pass to the global error handler
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
