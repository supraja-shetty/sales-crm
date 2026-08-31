const bcrypt = require("bcryptjs");
const { Admin } = require("../schemas/adminSchema");
const generateToken = require("../utils/generateToken");
const logActivity = require("../utils/activity");

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await Admin.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !user.active || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  await logActivity({
    user,
    action: "LOGIN",
    entityType: "Auth",
    description: `${user.name} logged in`
  });

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  res.json({ token: generateToken(user), user: safeUser });
}

async function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
}

module.exports = { login, me };
