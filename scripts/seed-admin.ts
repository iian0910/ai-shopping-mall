import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../src/models/Admin";

const ADMIN_EMAIL = "admin@test.com";
const ADMIN_PASSWORD = "admin123456";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI environment variable");

  await mongoose.connect(uri);
  console.log("已連線到 MongoDB");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { $set: { passwordHash } },
    { upsert: true, returnDocument: "after" }
  );

  console.log(`管理員帳號已就緒: ${admin.email}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
