const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

module.exports = {
  s3,
  ListObjectsV2Command,
  DeleteObjectCommand,
  PutObjectCommand,
};
