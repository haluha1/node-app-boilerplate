const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
// const passport = require('passport');
// const cookieParser = require('cookie-parser');
const httpStatus = require('http-status');
const OpenApiValidator = require('express-openapi-validator');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const config = require('./config/config');
const morgan = require('./config/morgan');
// const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const swaggerDocument = YAML.load('./swagger/swagger.yaml');
const { callAPI } = require("./utils/common")
const app = express();
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// // jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// app.use(cookieParser());
// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: './swagger/swagger.yaml',
//     validateRequests: true, // (default)
//     validateResponses: true, // false by default
//   }),
// );

const options = {
  explorer: true
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
// If you set app.set('trust proxy', true), 
// req.ip will return the real IP address even if behind proxy. 
// Check the documentation for further information
// https://expressjs.com/en/4x/api.html#req.ip
// ip => X-Real-IP
// ips => X-Forwarded-For
app.set('trust proxy', true);

app.get('/ip', (req, res) => {
  let result = {};
  try {
    result = {
      "ip_address": req?.ip,
      "x-forwarded-for": req?.ips
    }
    res.json(result);
  } catch (error) {
    next(new ApiError(httpStatus.BAD_GATEWAY, error?.message || 'Internal server error'));
  }
});

app.get('/ip/info', async (req, res, next) => {
  try {
    let ip = req.ip;
    const url = new URL("https://ipgeolocation.abstractapi.com/v1/");
    url.searchParams.set('api_key', process.env?.API_KEY);
    url.searchParams.set('ip_address', ip);
    const result = await callAPI(url);
    result['x-forwarded-for'] = req.ips;
    res.status(200).json(result);
  } catch (error) {
    next(new ApiError(httpStatus.BAD_GATEWAY, error?.message || 'Internal server error'));
  }

});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;