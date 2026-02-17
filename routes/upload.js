const express = require("express");
const router = express.Router();
const {
  s3,
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} = require("../middleware/s3");
const upload = require("../middleware/upload");
const sharp = require("sharp");

router.post("/upload/product", upload.array("files", 10), async (req, res) => {
  console.log(req.files); // Log to check the structure of req.files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    const upload_promises = req.files.map(async (file) => {
      console.log(file); // Log each file object
      const buffer1 = await sharp(file.buffer)
        .resize({ width: 720, height: 960 })
        .jpeg({ quality: 80 })
        .toBuffer();
      const buffer2 = await sharp(file.buffer)
        .resize({ width: 480, height: 640 })
        .jpeg({ quality: 70 })
        .toBuffer();
      const buffer3 = await sharp(file.buffer)
        .resize({ width: 120, height: 160 })
        .jpeg({ quality: 50 })
        .toBuffer();

      const fileKey1 = `products/${Date.now()}-meneMarket-720px-${
        file.originalname
      }`;
      const fileKey2 = `products/${Date.now()}-meneMarket-480px-${
        file.originalname
      }`;
      const fileKey3 = `products/${Date.now()}-meneMarket-120px-${
        file.originalname
      }`;

      const parameters_720 = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey1,
        Body: buffer1,
        ContentType: file.mimetype,
      };

      const parameters_480 = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey2,
        Body: buffer2,
        ContentType: file.mimetype,
      };

      const parameters_120 = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey3,
        Body: buffer3,
        ContentType: file.mimetype,
      };

      const command1 = new PutObjectCommand(parameters_720);
      const command2 = new PutObjectCommand(parameters_480);
      const command3 = new PutObjectCommand(parameters_120);

      await s3.send(command1);
      await s3.send(command2);
      return s3.send(command3).then(() => ({
        urls: {
          large: `${process.env.R2_RECORDS_ENDPOINT}/${fileKey1}`,
          medium: `${process.env.R2_RECORDS_ENDPOINT}/${fileKey2}`,
          small: `${process.env.R2_RECORDS_ENDPOINT}/${fileKey3}`,
        },
      }));
    });

    const upload_results = await Promise.all(upload_promises);

    return res
      .status(200)
      .json({ files: upload_results.map((file) => file.urls) });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error while uploading", error: error });
  }
});

router.post("/upload/profile", upload.single("file"), async (req, res) => {
  console.log(req.file); // Log to check the structure of req.files
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const buffer1 = await sharp(req.file.buffer)
      .resize({ width: 480, height: 480 })
      .jpeg({ quality: 40 })
      .toBuffer();
    const fileKey1 = `profile_pics/${Date.now()}-meneMarket-480px-${
      req.file.originalname
    }`;

    const buffer2 = await sharp(req.file.buffer)
      .resize({ width: 120, height: 120 })
      .jpeg({ quality: 40 })
      .toBuffer();
    const fileKey2 = `profile_pics/${Date.now()}-meneMarket-120px-${
      req.file.originalname
    }`;

    const parameters_480 = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey1,
      Body: buffer1,
      ContentType: req.file.mimetype,
    };

    const parameters_120 = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey2,
      Body: buffer2,
      ContentType: req.file.mimetype,
    };

    const command1 = new PutObjectCommand(parameters_480);
    const command2 = new PutObjectCommand(parameters_120);

    await s3.send(command1);
    await s3.send(command2);

    return res.status(200).json({
      message: "uploaded",
      urls: {
        original: `${process.env.R2_RECORDS_ENDPOINT}/${fileKey1}`,
        small: `${process.env.R2_RECORDS_ENDPOINT}/${fileKey2}`,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error while uploading", error: error });
  }
});

router.post("/upload/media", upload.array("files", 10), async (req, res) => {
  console.log(req.files); // Log to check the structure of req.files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    const upload_promises = req.files.map(async (file) => {
      console.log(file); // Log each file object
      const buffer1 = await sharp(file.buffer)
        .resize({ width: 720 })
        .jpeg({ quality: 80 })
        .toBuffer();
      const buffer2 = await sharp(file.buffer)
        .resize({ width: 480 })
        .jpeg({ quality: 70 })
        .toBuffer();
      const buffer3 = await sharp(file.buffer)
        .resize({ width: 120 })
        .jpeg({ quality: 50 })
        .toBuffer();

      const fileKey1 = `photos/${Date.now()}-meneMarket-720px-${
        file.originalname
      }`;
      const fileKey2 = `photos/${Date.now()}-meneMarket-480px-${
        file.originalname
      }`;
      const fileKey3 = `photos/${Date.now()}-meneMarket-120px-${
        file.originalname
      }`;

      const parameters_720 = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey1,
        Body: buffer1,
        ContentType: file.mimetype,
      };

      const parameters_480 = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey2,
        Body: buffer2,
        ContentType: file.mimetype,
      };

      const parameters_120 = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey3,
        Body: buffer3,
        ContentType: file.mimetype,
      };

      const command1 = new PutObjectCommand(parameters_720);
      const command2 = new PutObjectCommand(parameters_480);
      const command3 = new PutObjectCommand(parameters_120);

      await s3.send(command1);
      await s3.send(command2);
      return s3.send(command3).then(() => ({
        urls: {
          large: `${process.env.R2_RECORDS_ENDPOINT}/${fileKey1}`,
          medium: `${process.env.R2_RECORDS_ENDPOINT}/${fileKey2}`,
          small: `${process.env.R2_RECORDS_ENDPOINT}/${fileKey3}`,
        },
      }));
    });

    const upload_results = await Promise.all(upload_promises);

    return res
      .status(200)
      .json({ files: upload_results.map((file) => file.urls) });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error while uploading", error: error });
  }
});

router.get("/all", async (req, res) => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
  });

  try {
    const data = await s3.send(command);

    // Check if data.Contents is defined and has objects
    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ message: "No files found in the bucket" });
    }

    const files = data.Contents.map((file) => ({
      key: file.Key,
      url: `${process.env.R2_RECORDS_ENDPOINT}/${file.Key}`,
    }));

    res.status(200).json(files);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error while fetching", error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const keys = req.body.keys;
    if (keys.length < 1) {
      return res
        .status(404)
        .json({ message: "No keys provided or invalid input" });
    }
    const delete_promices = keys.map((key) => {
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${key}`,
      });
      s3.send(command);
    });

    console.log(delete_promices);

    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "error while deleting", error: error });
  }
});

module.exports = router;

// Swagger documentation for upload and media routes

/**
 * @swagger
 * /files/upload/product:
 *   post:
 *     summary: Upload files to the server format 3 x 4 jpeg
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: "File uploaded successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imgUrl:
 *                   type: string
 *                   description: The URL where the uploaded image can be accessed
 *       400:
 *         description: "No file selected"
 */

/**
 * @swagger
 * /files/upload/profile:
 *   post:
 *     summary: Upload files to the server format 1 x 1 jpeg
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: "File uploaded successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imgUrl:
 *                   type: string
 *                   description: The URL where the uploaded image can be accessed
 *       400:
 *         description: "No file selected"
 */

/**
 * @swagger
 * /files/upload/media:
 *   post:
 *     summary: Upload files to the server format w 720 h flex jpeg
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: "File uploaded successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imgUrl:
 *                   type: string
 *                   description: The URL where the uploaded image can be accessed
 *       400:
 *         description: "No file selected"
 */

/**
 * @swagger
 * /files/delete:
 *   delete:
 *     summary: Deletes files by keys
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keys:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of file keys to delete
 *     responses:
 *       200:
 *         description: Files deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: No keys provided or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Error while deleting files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /files/all:
 *   get:
 *     summary: gets list of files
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: "File deleted successfully"
 *       404:
 *         description: "File not found"
 *       500:
 *         description: "An error occurred during deletion"
 */
