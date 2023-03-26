function CompileError(code, message) {
  const instance = new Error(message);
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  instance.name = 'CompileError';
  instance.code = code;
  return instance;
}
CompileError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
if (Object.setPrototypeOf) {
  Object.setPrototypeOf(CompileError, Error);
} else {
  CompileError.__proto__ = Error;
}

module.exports = CompileError
