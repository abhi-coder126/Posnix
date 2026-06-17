const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    const exist = await User.findOne({ email: normalizedEmail });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      role: "admin",
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({
      email: {
        $regex: `^${escapeRegExp(normalizedEmail)}$`,
        $options: "i",
      },
    });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isHashedPassword = user.password?.startsWith("$2");
    const match = isHashedPassword
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!match) return res.status(400).json({ message: "Invalid password" });

    if (!isHashedPassword) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
