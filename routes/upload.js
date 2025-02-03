const express = require("express");
const router = express.Router();
const s3 = require("../middleware/s3")
const upload = require("../middleware/upload")

router.post("/upload", upload.array("files", 10), async (req, res) =>{
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({message: "no files uploaded"})
  }

  try {
    const upload_promises = req.files.map((file) => {
      const parameters = {
        Bucket: process.env.DO_SPACES_BUCKET,
        key: `products/${Date.now()}-meneMarket-${file.originalname}`,
        body: file.buffer,
        ACL: "public-read",
        contentType: file.file.mimetype,
      };
      return s3.upload(parameters).promise()
    });

    const upload_results = await Promise.all(upload_promises)

    return res.status(200).json({files: upload_results.map((file) => file.location)})
  } catch (error) {
    console.log(error);
    res.status(400).json({message: "error while uploading", error: error})
  }
})

router.get("/all", async (req, res) =>{
  const parameters = {Bucket: process.env.DO_SPACES_BUCKET}

  try {
    const data = await s3.listObjectsV2(parameters).promise();
    const files = data.Contents.map((file) => ({
      key: file.Key,
      url: `${process.env.DO_SPACES_ENDPOINT}/${process.env.DO_SPACES_BUCKET}/${file.Key}`
    }))
    res.status(200).json(files)
  } catch (error) {
    console.log(error);
    res.status(400).json({message: "error while fetching", error: error})
  }
})

router.delete("/delete/:file_key", async (req, res) =>{
  const file_key = req.params.file_key

  const parameters = {
    Bucket: process.env.DO_SPACES_BUCKET,
    key: `product/${file_key}`
  }

  try {
    await s3.deleteObject(parameters).promise()
    res.status(200).json({message: "deleted successfully"})
  } catch (error) {
    console.log(error);
    res.status(400).json({message: "error while deleting", error: error})
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

