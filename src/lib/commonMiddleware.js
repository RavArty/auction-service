// import core
const middy = require("@middy/core");
// import some middlewares
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpErrorHandler = require("@middy/http-error-handler");
const httpEventNormalizer = require("@middy/http-event-normalizer");

export default (handler) =>
  middy(handler).use([httpEventNormalizer(), httpJsonBodyParser(), httpErrorHandler()]);
