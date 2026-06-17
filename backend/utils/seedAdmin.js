const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {
  const password = process.env.ADMIN_PASSWORD || "posnix@1122";
  const email = (process.env.ADMIN_EMAIL || "admin@posnix.com").trim().toLowerCase();
  const name = process.env.ADMIN_NAME || "Admin";

  const existingAdmin = await User.findOne({ email });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.email = email;
    existingAdmin.password = hashedPassword;
    existingAdmin.role = "admin";
    await existingAdmin.save();
    return;
  }

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });
};

module.exports = seedAdmin;
