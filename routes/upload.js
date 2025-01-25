const getUploadMiddleware = require("../middleware/upload");
const express = require("express");
const router = express.Router();

router.post('/upload', async (req, res) => {
    try {
      const upload = await getUploadMiddleware();
      upload.single('file')(req, res, (err) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.json({ file: req.file });
      });
    } catch (err) {
      res.status(500).send(`Error initializing upload: ${err.message}`);
    }
  });
  

module.exports = router;

// Swagger documentation for upload and media routes

/**
 * @swagger
 * /file/upload:
 *   post:
 *     summary: Upload a file to the server
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
 * /file/{filename}:
 *   get:
 *     summary: Retrieve a file by filename
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the file to retrieve
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
 * /file/{filename}:
 *   delete:
 *     summary: Delete a file by filename
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the file to delete
 *     responses:
 *       200:
 *         description: "File deleted successfully"
 *       404:
 *         description: "File not found"
 *       500:
 *         description: "An error occurred during deletion"
 */

