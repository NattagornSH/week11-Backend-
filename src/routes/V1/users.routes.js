import { Router } from "express";
import { users } from "../../mockData/fakeUsers.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json(users);
});

// สร้าง POST endpoint สำหรับเพิ่ม user ใหม่
router.post("/", (req, res) => {
  // ดึง username และ email จาก request body (ถ้าไม่มีให้ใช้ object ว่าง)
  const { username, email } = req.body || {};

  // ตรวจสอบว่ามี username และ email หรือไม่
  if (!username || !email) {
    // ถ้าไม่มี ส่ง error 400 (Bad Request) กลับไป
    return res.status(400).json({ error: "username and email are required" });
  }

  // หา ID ถัดไปโดยการหา ID ที่ใหญ่ที่สุดใน users array แล้วบวก 1
  const nextId = String(
    // ใช้ reduce วนหา ID ที่ใหญ่ที่สุด (เริ่มจาก 0) แล้วบวก 1
    (users.reduce((max, u) => Math.max(max, Number(u.id)), 0) || 0) + 1
  );

  // สร้าง user object ใหม่ด้วย id, username, email
  const newUser = { id: nextId, username, email };

  // เพิ่ม user ใหม่เข้าไปใน users array
  users.push(newUser);

  // ส่ง response 201 (Created) พร้อมข้อมูล user ที่สร้างใหม่
  return res.status(201).json(newUser);
});

// PUT เปลี่ยนแปลงข้อมูล
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
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
