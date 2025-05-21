const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/user');


//sign up
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists. Please use a different one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: "User created successfully", user_id: newUser.user_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Login --- (update)
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

   
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, manager_name: user.name },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    await user.update({ token });

    res.status(200).json({
      token,
      user_id: user.user_id,
      role: user.role,
      name: user.name, // new 
      message: "Login successful"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Complete Profile 
const completeProfile = async (req, res) => {
  const userId = req.params.user_id;
  const { address, phone_number } = req.body;

  try {
    const updated = await User.update(
      { address, phone_number },
      { where: { user_id: userId } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: "User not found or nothing to update" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signup,
  login,
  completeProfile
};