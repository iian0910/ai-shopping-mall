import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(__dirname, "../.env.local") });

import fs from "node:fs/promises";
import mongoose from "mongoose";
import { put } from "@vercel/blob";
import { Product } from "../src/models/Product";

const productImages: { name: string; localFile: string }[] = [
  { name: "無線藍牙耳機", localFile: "wireless-earbuds.jpg" },
  { name: "機械式鍵盤", localFile: "mechanical-keyboard.jpg" },
  { name: "USB-C 快充充電器", localFile: "usb-c-charger.jpg" },
  { name: "保溫杯 500ml", localFile: "thermos-bottle.jpg" },
  { name: "行動電源 10000mAh", localFile: "power-bank.jpg" },
];

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!mongoUri) throw new Error("Missing MONGODB_URI environment variable");
  if (!blobToken) throw new Error("Missing BLOB_READ_WRITE_TOKEN environment variable");

  await mongoose.connect(mongoUri);
  console.log("已連線到 MongoDB");

  for (const { name, localFile } of productImages) {
    const filePath = path.resolve(__dirname, "../public/products", localFile);
    const buffer = await fs.readFile(filePath);

    const filename = `products/${name}-${Date.now()}.jpg`;
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: "image/jpeg",
      token: blobToken,
    });

    const result = await Product.findOneAndUpdate(
      { name },
      { $set: { images: [blob.url] } },
      { returnDocument: "after" }
    );

    if (!result) {
      console.warn(`找不到商品: ${name}`);
      continue;
    }
    console.log(`已更新 ${name} -> ${blob.url}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
