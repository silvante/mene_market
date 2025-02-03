const express = require("express");
const router = express.Router();
const { s3, DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } = require("../middleware/s3")
const upload = require("../middleware/upload");

router.post("/upload", upload.array("files", 10), async (req, res) => {
  console.log(req.files);  // Log to check the structure of req.files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    const upload_promises = req.files.map((file) => {
      console.log(file);  // Log each file object
      const fileKey = `products/${Date.now()}-meneMarket-${file.originalname}`;
      const parameters = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ACL: "public-read",
        ContentType: file.mimetype,
      };
      
      const command = new PutObjectCommand(parameters);
      return s3.send(command).then(() => ({
        url: `${process.env.DO_SPACES_ENDPOINT}/${process.env.DO_SPACES_BUCKET}/${fileKey}`
      }))
    });

    const upload_results = await Promise.all(upload_promises);

    return res.status(200).json({ files: upload_results.map((file) => file.url) });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while uploading", error: error });
  }
});

router.get("/all", async (req, res) => {
  const command = new ListObjectsV2Command({ Bucket: process.env.DO_SPACES_BUCKET });

  try {
    const data = await s3.send(command);

    // Check if data.Contents is defined and has objects
    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ message: "No files found in the bucket" });
    }

    const files = data.Contents.map((file) => ({
      key: file.Key,
      url: `${process.env.DO_SPACES_ENDPOINT}/${process.env.DO_SPACES_BUCKET}/${file.Key}`
    }));
    
    res.status(200).json(files);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while fetching", error: error.message });
  }
});


router.delete("/delete/:file_key", async (req, res) => {
  const file_key = req.params.file_key

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: `products/${file_key}`
    })

    await s3.send(command)

    res.status(200).json({ message: "deleted successfully" })
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error while deleting", error: error })
  }
})


module.exports = router;

// Swagger documentation for upload and media routes

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload files to the server
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
 * /files/{file_key}:
 *   delete:
 *     summary: deletes file by key
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: file_key
 *         required: true
 *         schema:
 *           type: string
 *         description: The file_key of the file to delete
 *     responses:
 *       200:
 *         description: "File retrieved successfully"
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: "File not found"
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

