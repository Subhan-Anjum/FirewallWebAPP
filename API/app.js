var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet'); // Import helmet for setting HTTP headers
require('dotenv').config();
require('./utils/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// ADMIN 
var adminLoginRouter = require('./routes/Admin/adminlogin');
var authentication = require('./routes/Admin/authentication');
var addInventoryRouter = require('./routes/Admin/addInventory');
var addBrandRouter = require('./routes/Admin/addBrand');
var getBrandRouter = require('./routes/Admin/GetBrands');
var getInventoryRouter = require('./routes/Admin/getInventory');
var deleteInventoryRouter = require('./routes/Admin/deleteInventory');
var deletebrandRouter = require('./routes/Admin/deleteBrand');
var updateBrandRouter = require('./routes/Admin/updateBrand');
var updateInventoryRouter = require('./routes/Admin/updateInventory');
var registerRouter = require('./routes/Users/register');
var verifyRouter = require('./routes/Users/verify');
var loginRouter = require('./routes/Users/login');
var changeStatusRouter = require('./routes/Admin/changestatus');
var changeInventoryStatusRouter = require('./routes/Admin/changeInventoryStatus');
var getUsersRouter = require('./routes/Admin/getUsers');
var deleteUserRouter = require('./routes/Admin/deleteUser');
var addUserRouter = require('./routes/Admin/addUser');
var updateUserRouter = require('./routes/Admin/updateUser');
var updateAdminRouter = require('./routes/Admin/updateAdmin');
var updateCredentialsRouter = require('./routes/Admin/updateCredentials');
var addtoCartRouter = require('./routes/Users/addtoCart');
var getCartRouter = require('./routes/Users/getCart');
var deleteCartRouter = require('./routes/Users/deleteCart');
var buyProductRouter = require('./routes/Users/buyProduct');
var buyRouter = require('./routes/Users/buy');
var getOrdersRouter = require('./routes/Users/getOrders');
var getAllOrdersRouter = require('./routes/Admin/getOrders');
var getDashboardRouter = require('./routes/Admin/getDashboard');
var reviewRouter = require('./routes/Users/review');
var getReviewsRouter = require('./routes/Users/getReviews');
var supportRouter = require('./routes/Users/support');
var getSupportRouter = require('./routes/Users/getSupport');
var replyRouter = require('./routes/Users/reply');
var getProfileRouter = require('./routes/Users/getProfile');
var updateProfileRouter = require('./routes/Users/updateProfile');
var frontendLogsRouter = require('./routes/Users/frontendLogs');

var app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);



function validateAPIKey(req, res, next) {
  const authkey =  req.header('api-key');
  if (authkey && crypto.createHash('sha256').update(authkey).digest('hex') == process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized Access' });
  }
}

// app.use(helmet());

app.use((req, res, next) => {
  if (req.path.startsWith('/images') || req.path.startsWith('/buy')) {
    return next();
  }
  validateAPIKey(req, res, next);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authentication', authentication);
app.use('/adminlogin', adminLoginRouter);
app.use('/addInventory', addInventoryRouter);
app.use('/addBrand', addBrandRouter);
app.use('/getBrands', getBrandRouter);
app.use('/getInventory', getInventoryRouter);
app.use('/deleteInventory', deleteInventoryRouter);
app.use('/deletebrands', deletebrandRouter);
app.use('/updateBrand', updateBrandRouter);
app.use('/updateInventory', updateInventoryRouter);
app.use('/changeStatus', changeStatusRouter);
app.use('/changeStatusInventory', changeInventoryStatusRouter);
app.use('/getusers', getUsersRouter);
app.use('/deleteuser', deleteUserRouter);
app.use('/addUser', addUserRouter);
app.use('/updateUser', updateUserRouter);
app.use('/updateAdmin', updateAdminRouter);
app.use('/updateCredentials', updateCredentialsRouter);
app.use('/addtoCart', addtoCartRouter);
app.use('/getAllOrders', getAllOrdersRouter);
app.use('/getDashboard', getDashboardRouter);  

// Users
app.use('/register', registerRouter);
app.use('/verify', verifyRouter);
app.use('/login', loginRouter);  
app.use('/getCart', getCartRouter);  
app.use('/deleteCart', deleteCartRouter);  
app.use('/buyProduct', buyProductRouter);  
app.use('/buy', buyRouter);  
app.use('/getOrders', getOrdersRouter);  
app.use('/review', reviewRouter);  
app.use('/getReviews', getReviewsRouter);  
app.use('/support', supportRouter);  
app.use('/getSupport', getSupportRouter);  
app.use('/reply', replyRouter);  
app.use('/getProfile', getProfileRouter);  
app.use('/updateProfile', updateProfileRouter); 
app.use('/frontendLogs', frontendLogsRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
