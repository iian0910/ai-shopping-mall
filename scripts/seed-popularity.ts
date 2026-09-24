import { config } from "dotenv";
import path from "node:path";
import mongoose from "mongoose";

config({ path: path.resolve(__dirname, "../.env.local") });
import { Product } from "../src/models/Product";

// 尚未串接金流，無法從訂單計算實際熱門度，先以固定百分比（0–100）寫入。
const productPopularity: { name: string; popularity: number }[] = [
  { name: "小兔子｜把軟綿綿的好心情抱回家", popularity: 100 },
  { name: "大象｜大大的耳朵，裝得下好多好多心事", popularity: 80 },
  { name: "小海豚｜帶著海洋的溫柔，游進你的懷裡", popularity: 60 },
  { name: "小猴子｜今天也一起開心玩耍吧！", popularity: 40 },
  { name: "小海龜｜慢慢走，也能遇見好多美好的事情", popularity: 20 },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  await mongoose.connect(uri);
  console.log("已連線到 MongoDB");

  for (const { name, popularity } of productPopularity) {
    const result = await Product.updateOne({ name }, { $set: { popularity } });
    if (result.matchedCount === 0) {
      console.warn(`- 找不到商品：${name}`);
    } else {
      console.log(`- ${name} → ${popularity}%`);
    }
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
