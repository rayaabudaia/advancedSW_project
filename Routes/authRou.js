const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  completeProfile
} = require("../Controller/authCont");

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Complete profile
router.put("/profile/:user_id", completeProfile);

module.exports = router;
