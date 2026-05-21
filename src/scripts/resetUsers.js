import mongoose from "mongoose";
import { User } from "../modules/users/user.model.js";
import { connectDB } from "../config/mongodb.js";

const resetUsers = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();

    console.log("🗑️  Deleting all existing users...");
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);

    console.log("\n👤 Creating test users...");

    // Create Charlie
    const charlie = await User.create({
      username: "Charlie",
      email: "charlie@example.com",
      password: "password123",
      role: "user",
    });
    console.log(`✅ Created user: ${charlie.username} (${charlie.email})`);

    // Create Admin
    const admin = await User.create({
      username: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    console.log(`✅ Created user: ${admin.username} (${admin.email})`);

    // Create Alice
    const alice = await User.create({
      username: "Alice",
      email: "alice@example.com",
      password: "alice123",
      role: "user",
    });
    console.log(`✅ Created user: ${alice.username} (${alice.email})`);

    console.log("\n🎉 All test users created successfully!");
    console.log("\n📝 You can now login with:");
    console.log("   - charlie@example.com / password123");
    console.log("   - admin@example.com / admin123");
    console.log("   - alice@example.com / alice123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetUsers();
