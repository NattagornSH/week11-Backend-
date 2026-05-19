/**
 * Async Handler Wrapper
 * ห่อหุ้ม async function เพื่อจัดการ error โดยอัตโนมัติ
 * ไม่ต้องเขียน try-catch ในทุก controller
 *
 * @param {Function} fn - Async function ที่ต้องการห่อหุ้ม
 * @returns {Function} Express middleware function
 *
 * @example
 * export const getAllUsers = asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json({ success: true, data: users });
 * });
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
