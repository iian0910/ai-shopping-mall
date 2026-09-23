import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(__dirname, "../.env.local") });

import fs from "node:fs/promises";
import mongoose from "mongoose";
import { put } from "@vercel/blob";
import { Article } from "../src/models/Article";

const articleImages: { title: string; localFile: string }[] = [
  { title: "療癒系列：在忙碌生活中找回內心平靜的五個方法", localFile: "inner-peace.jpg" },
  { title: "療癒系列：打造專屬你的居家療癒角落", localFile: "healing-corner.jpg" },
];

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!mongoUri) throw new Error("Missing MONGODB_URI environment variable");
  if (!blobToken) throw new Error("Missing BLOB_READ_WRITE_TOKEN environment variable");

  await mongoose.connect(mongoUri);
  console.log("已連線到 MongoDB");

  for (const { title, localFile } of articleImages) {
    const filePath = path.resolve(__dirname, "../public/articles", localFile);
    const buffer = await fs.readFile(filePath);

    const filename = `articles/${localFile.replace(/\.jpg$/, "")}-${Date.now()}.jpg`;
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: "image/jpeg",
      token: blobToken,
    });

    const result = await Article.findOneAndUpdate(
      { title },
      { $set: { coverImage: blob.url } },
      { returnDocument: "after" }
    );

    if (!result) {
      console.warn(`找不到文章: ${title}`);
      continue;
    }
    console.log(`已更新 ${title} -> ${blob.url}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
