const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authControllers");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, cartController.getPopulatedUsers)
  .patch(authController.protect, cartController.populateUsers);

module.exports = router;
