const UserCart = require("../models/userCartModel");
const catchAsync = require("../error/catchAsync");

exports.getPopulatedUsers = catchAsync(async (req, res, next) => {
  const getDetails = await UserCart.findOne({ user_id: req.user._id }).populate(
    "user_id"
  );

  res.status(200).json({
    status: "success",
    body: {
      userData: getDetails,
    },
  });
});

exports.populateUsers = catchAsync(async (req, res, next) => {
  // const setDetails = await UserCart.findOneAndUpdate(
  //   { user_id: req.user._id },
  //   { cart: req.body },
  //   { new: true }
  // ).populate("user_id");

  const setDetails = await UserCart.findOne({ user_id: req.user._id }).populate(
    "user_id"
  );
  setDetails.cart = req.body;

  setDetails.save();

  res.status(200).json({
    status: "success",
    body: {
      userData: setDetails,
    },
  });
});
