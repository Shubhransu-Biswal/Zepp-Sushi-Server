const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please Provide An UserName"],
  },
  email: {
    type: String,
    required: [true, "Please Provide An Email"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide A Strong Password"],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please Confirm Your Password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not same",
    },
  },
});

// encrypting password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// instance method to check the password
userSchema.methods.checkPassword = async (
  dbStoredPassword,
  enteredPassword
) => {
  return await bcrypt.compare(enteredPassword, dbStoredPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
