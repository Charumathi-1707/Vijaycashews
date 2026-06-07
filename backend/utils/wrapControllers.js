const asyncHandler = require('../middleware/asyncHandler');

// Automatically wraps all exported functions of a controller module
// with asyncHandler — so you never forget to wrap one
const wrapControllers = (controllerModule) => {
  const wrapped = {};
  Object.keys(controllerModule).forEach((key) => {
    if (typeof controllerModule[key] === 'function') {
      wrapped[key] = asyncHandler(controllerModule[key]);
    } else {
      wrapped[key] = controllerModule[key];
    }
  });
  return wrapped;
};

module.exports = wrapControllers;
