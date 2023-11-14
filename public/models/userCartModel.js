const mongoose = require("mongoose");

const userCartItemsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cart: {
    type: Object,
    default: {},
  },
});

// Is not working
// Use a default factory function to set the default value for the 'cart' field
userCartItemsSchema.path("cart").default(function () {
  return {};
});

const UserCart = mongoose.model("UserCart", userCartItemsSchema);

module.exports = UserCart;
