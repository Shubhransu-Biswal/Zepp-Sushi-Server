const User = require("../models/userModels");
const AppError = require("../error/appError");
const catchAsync = require("../error/catchAsync");
const jwt = require("jsonwebtoken");
const UserCart = require("../models/userCartModel");
const { promisify } = require("util");

// all users controller
exports.users = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    body: {
      users,
    },
  });
});

// signup controller
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  //creating cart for that user
  const cartObj = {
    items: [],
    totalAmount: 0,
    isOne: 0,
  };
  const userCart = await UserCart.create({
    user_id: user._id,
    cart: cartObj,
  });
  res.status(200).json({
    status: "success",
    body: {
      user,
    },
  });
});

// login controller
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // checking for existence
  if (!email || !password) {
    return next(new AppError("Please Enter Your Email and Password", 400));
  }

  // checking if user email and password is correct or not
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkPassword(user.password, password))) {
    return next(new AppError("Enter A Valid Email And Password", 401));
  }

  // if everything went well then create and give the token
  const token = await promisify(jwt.sign)(
    { id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(200).json({
    status: "success",
    token,
    body: {
      user,
    },
  });
});

// protect routes controller
exports.protect = catchAsync(async (req, res, next) => {
  // set if the token string exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // check if the token exists
  if (!token) {
    return next(new AppError("Please Log In To Continue", 401));
  }

  //verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User No Longer Exists", 404));
  }

  // check if the user changed the password after receiving the token
  // I am not adding this step for now because there is no feature to change password
  // Grant the access
  req.user = currentUser;
  next();
});
