import { config } from "dotenv";
import path from "node:path";
import mongoose from "mongoose";

config({ path: path.resolve(__dirname, "../.env.local") });
import { Product } from "../src/models/Product";

const sampleProducts = [
  { name: "無線藍牙耳機", price: 1290 },
  { name: "機械式鍵盤", price: 2490 },
  { name: "USB-C 快充充電器", price: 590 },
  { name: "保溫杯 500ml", price: 390 },
  { name: "行動電源 10000mAh", price: 790 },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  await mongoose.connect(uri);
  console.log("已連線到 MongoDB");

  await Product.deleteMany({});
  const created = await Product.insertMany(sampleProducts);
  console.log(`已建立 ${created.length} 筆商品資料：`);
  created.forEach((p) => console.log(`- ${p.name} $${p.price}`));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
