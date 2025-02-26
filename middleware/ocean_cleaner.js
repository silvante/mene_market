const { s3, ListObjectsV2Command, DeleteObjectCommand } = require("./s3");
const mongoose = require("mongoose");
const connDB = require("../db");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Blog = require("../models/blog.model");
const News = require("../models/news.model");

const ListAllFilekeys = async () => {
  let files = [];
  let continuationToken = undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: process.env.DO_SPACES_BUCKET,
      ContinuationToken: continuationToken,
    });

    const { Contents, NextContinuationToken } = await s3.send(command);

    if (Contents) {
      files.push(...Contents.map((file) => file.key));
    }
    continuationToken = NextContinuationToken;
  } while (continuationToken);

  return files;
};

function extractFilePath(url) {
  try {
    if (!url) return null;
    return new URL(url).pathname.replace(/^\/+/, "");
  } catch (error) {
    console.warn(`Invalid URL: ${url}, skipping...`);
    return null;
  }
}

const clean_the_ocean = async () => {
  let shouldCloseConnection = mongoose.connection.readyState === 0;
  try {
    console.log("process ocean clean has began...");

    if (shouldCloseConnection) {
      await connDB();
    }
    let used_images = new Set();

    // users
    const users = await User.find({}, "avatar").lean();
    users.forEach((user) => {
      [user.avatar?.original, user.avatar?.small].forEach((url) => {
        const filepath = extractFilePath(url);
        if (filepath) used_images.add(filepath);
      });
    });

    // products
    const products = await Product.find({}, "images").lean();
    products.forEach((product) => {
      product.images.forEach((image) => {
        [image.large, image.medium, image.small].forEach((url) => {
          const filepath = extractFilePath(url);
          if (filepath) used_images.add(filepath);
        });
      });
    });

    // blogs
    const blogs = await Blog.find({}, "banner").lean();
    blogs.forEach((blog) => {
      [blog.banner.large, blog.banner.medium, blog.banner.small].forEach(
        (url) => {
          const filepath = extractFilePath(url);
          if (filepath) used_images.add(filepath);
        }
      );
    });

    // news
    const news = await News.find({}, "banner").lean();
    news.forEach((news) => {
      [news.banner.large, news.banner.medium, news.banner.small].forEach(
        (url) => {
          const filepath = extractFilePath(url);
          if (filepath) used_images.add(filepath);
        }
      );
    });

    const all_files = await ListAllFilekeys();

    for (const file_key of all_files) {
      if (!used_images.has(file_key)) {
        console.log(`deleting orphaned image: ${file_key}`);
        const delete_command = new DeleteObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: file_key,
        });
        await s3.send(delete_command);
      }
    }
    console.log("cleaning process has been ended successful!");
  } catch (error) {
    console.log(error.message);
  } finally {
    if (shouldCloseConnection) {
      mongoose.connection.close();
    }
  }
};

module.exports = clean_the_ocean;
// clean_the_ocean();
