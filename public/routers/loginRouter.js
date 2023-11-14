const express = require("express");
const authControllers = require("../controllers/authControllers");
const router = express.Router();

router.route("/").post(authControllers.login);

module.exports = router;
