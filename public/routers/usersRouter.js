const express = require("express");
const authControllers = require("../controllers/authControllers");
const router = express.Router();

router.route("/").get(authControllers.users);

module.exports = router;
