import bcrypt from "bcrypt";

async function hashPassword(string) {
  const hashedPassword = await bcrypt.hash(string, 12);
  return hashedPassword;
}

// const password = await hashPassword("John456");
// console.log("Hashed Password:", password);

console.log(
  await bcrypt.compare(
    "John456",
    "$2b$12$CgfvkGE39gXZKlghHDcuyuM0Ul.6hWIJIBDpxnzVnJ3rvBRbwjaaq"
  )
);
