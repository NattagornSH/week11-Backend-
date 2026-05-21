import { User } from "./user.model.js";
import bcrypt from "bcrypt";

const userResponse = (doc) => {
  const user = doc.toObject();
  delete user.password;
  return user;
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  const { username, email, password, role } = req.body || {};

  if (!username || !email || !password) {
    const err = new Error("username, email, and password are required");
    err.name = "ValidationError";
    err.status = 400;
    return res.status(400).json({ success: false, error: err });
  }

  try {
    const doc = await User.create({ username, email, password, role });

    return res.status(201).json({ success: true, data: userResponse(doc) });
  } catch (err) {
    // return res.status(400).json({ success: false, error: err });
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { username, email, password, role } = req.body || {};
  const updates = {};

  if (username !== undefined) updates.username = username;
  if (email !== undefined) updates.email = email;
  if (password !== undefined) updates.password = password;
  if (role !== undefined) updates.role = role;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      error: "At least one field is required to update",
    });
  }

  try {
    const doc = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    // console.log(err);
    // return res.status(400).json({ success: false, error: err });
    err.status = 400;
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const doc = await User.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    // return res.status(400).json({ success: false, error: err });
    next(err);
  }
};

export const createUsersHash = async (req, res, next) => {
  const { password, email, username, role } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "email already use.", success: false });
    }
    const newPassword = await bcrypt.hash(password, 12);
    const doc = await User.create({
      email,
      username,
      password: newPassword,
      role,
    });
    res.status(201).json({ success: true, data: userResponse(doc) });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body || {};

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "email and password are required",
    });
  }

  try {
    // 🔍 หา user ในฐานข้อมูล (ต้อง select password ด้วย)
    const userInDB = await User.findOne({ email }).select("+password");

    // ถ้าไม่เจอ user
    if (!userInDB) {
      return res.status(401).json({
        success: false,
        error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    // ตรวจสอบว่ามี password field หรือไม่
    if (!userInDB.password) {
      return res.status(500).json({
        success: false,
        error: "User password not found in database",
      });
    }

    // 🔐 เปรียบเทียบ password ด้วย bcrypt
    const isMatch = await bcrypt.compare(password, userInDB.password);

    // ถ้า password ไม่ตรง
    if (isMatch === false) {
      return res.status(401).json({
        success: false,
        error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    // ✅ Login สำเร็จ
    return res.status(200).json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ!",
      data: userResponse(userInDB),
    });
  } catch (err) {
    next(err);
  }
};
