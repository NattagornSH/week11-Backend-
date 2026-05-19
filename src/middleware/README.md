# Centralized Error Handling

## 📁 ไฟล์ที่เกี่ยวข้อง

- `middleware/errorHandler.js` - Error handling middleware
- `utils/asyncHandler.js` - Async wrapper สำหรับ controllers

## 🎯 วิธีใช้งาน

### 1. ใช้ `asyncHandler` ใน Controller

```javascript
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../middleware/errorHandler.js";

// ✅ แบบใหม่ - ไม่ต้องเขียน try-catch
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

// ✅ Throw error ด้วย AppError
export const createUser = asyncHandler(async (req, res) => {
  if (!username) {
    throw new AppError("Username is required", 400);
  }

  const user = await User.create({ username, email });
  res.status(201).json({ success: true, data: user });
});
```

### 2. Error Response Format

ทุก error จะถูกจัดการโดย `errorHandler` และส่ง response ในรูปแบบเดียวกัน:

```json
{
  "success": false,
  "error": {
    "message": "User not found!",
    "stack": "..." // เฉพาะ development mode
  }
}
```

## 🔍 Error Types ที่จัดการอัตโนมัติ

### MongoDB Errors

- **ValidationError** - ข้อมูลไม่ผ่าน validation
- **CastError** - ID ไม่ถูกต้อง
- **Duplicate Key (11000)** - ข้อมูลซ้ำ

### Supabase Errors

- **PGRST errors** - PostgreSQL errors จาก Supabase

### Custom Errors

- **AppError** - Error ที่สร้างเองด้วย statusCode

## 📝 ตัวอย่างการใช้งาน

### ❌ แบบเก่า (ไม่แนะนำ)

```javascript
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
```

### ✅ แบบใหม่ (แนะนำ)

```javascript
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ success: true, data: user });
});
```

## 🚀 ประโยชน์

✅ **DRY** - ไม่ต้องเขียน try-catch ซ้ำๆ  
✅ **Consistent** - Error format เหมือนกันทั้งหมด  
✅ **Maintainable** - แก้ไขที่เดียว ใช้ได้ทั้งระบบ  
✅ **Clean Code** - Controller สั้น อ่านง่าย  
✅ **Auto Logging** - Log error อัตโนมัติ
