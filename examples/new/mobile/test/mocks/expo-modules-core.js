class EventEmitter {}
class NativeModule {}
class SharedObject {}

class CodedError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = {
  EventEmitter,
  NativeModule,
  SharedObject,
  requireNativeModule: () => ({}),
  requireOptionalNativeModule: () => null,
  registerWebModule: () => undefined,
  CodedError,
};
