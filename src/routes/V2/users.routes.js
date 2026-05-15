import { Router } from "express";
import { User } from "../../modules/users/user.model.js";

export const router = Router();

const userResponse = (doc) => {
  const user = doc.toObject();
  delete user.password;
  return user;
};

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

// สร้าง POST endpoint สำหรับเพิ่ม user ใหม่
router.post("/", async (req, res) => {
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
    return res.status(400).json({ success: false, error: err });
  }
});

// PUT เปลี่ยนแปลงข้อมูล
router.put("/:id", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      const err = new Error("username, email, and password are required");
      err.name = "ValidationError";
      err.status = 400;
      return res.status(400).json({ success: false, error: err });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, password, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found!" } });
    }

    return res
      .status(200)
      .json({ success: true, data: userResponse(updatedUser) });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

// สร้าง DELETE endpoint สำหรับลบ user ตาม id
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found!" } });
    }

    return res.status(200).json({
      success: true,
      data: {
        message: "User deleted successfully",
        user: userResponse(deletedUser),
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});
