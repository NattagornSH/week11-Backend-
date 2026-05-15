import express from "express";
import cors from "cors";
import { users } from "./mockData/fakeUsers.js";
import { router as apiRoutes } from "./routes/index.js";
import { connectDB } from "./config/mongodb.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Express + Tailwind</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="min-h-screen bg-gray-50 text-gray-800">
      <main class="max-w-2xl mx-auto p-8">
        <div class="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-8">
          <h1 class="text-3xl font-bold tracking-tight text-blue-600">
            Hello Client, I am your Server!
          </h1>
          <p class="mt-3 text-gray-600">
            This page is styled with <span class="font-semibold">Tailwind CSS</span> via CDN.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a href="/api/v2/users" class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              GET /users
            </a>
            <span class="text-xs text-gray-500">Try POST/PUT/DELETE with your API client.</span>
          </div>
        </div>
        <footer class="mt-10 text-center text-xs text-gray-400">
          Express server running with Tailwind via CDN
        </footer>
      </main>
    </body>
  </html>`);
});

app.use("/api", apiRoutes);

// app.get("/users", (req, res) => {
//   res.json(users);
// });

// สร้าง POST endpoint สำหรับเพิ่ม user ใหม่
app.post("/users", (req, res) => {
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
app.put("/users/:id", (req, res) => {
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
app.delete("/users/:id", (req, res) => {
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

const PORT = 3002;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🟢`);
});
