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
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username, email and password are required" });
  }

  user.username = username;
  user.email = email;
  user.password = password;

  res.status(200).json(user);
});

// สร้าง DELETE endpoint สำหรับลบ user ตาม id
router.delete("/:id", async (req, res) => {
  // หา index ของ user ที่ต้องการลบใน users array
  const userIndex = users.findIndex((u) => u.id === req.params.id);

  // ถ้าไม่เจอ user (index = -1)
  if (userIndex === -1) {
    // ส่ง error 404 (Not Found) กลับไป
    return res.status(404).json({ error: "User not found!" });
  }

  // ลบ user ออกจาก array โดยใช้ splice (ลบ 1 ตัว ที่ตำแหน่ง userIndex)
  const deletedUser = users.splice(userIndex, 1)[0];

  // ส่ง response 200 (OK) พร้อมข้อมูล user ที่ถูกลบ
  return res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser,
  });
});
