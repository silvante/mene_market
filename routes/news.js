const express = require("express");
const {
  getNews,
  getNewsById,
  createNews,
  editNews,
  deleteNews,
} = require("../controllers/news.controller");
const router = express.Router();

router.get("/", getNews);

router.get("/:id", getNewsById);

router.post("/", createNews);

router.put("/:id", editNews);

router.delete("/:id", deleteNews);

module.exports = router;

// Swagger documentation for News routes
/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Retrieve a list of news
 *     tags: [News]
 *     responses:
 *       200:
 *         description: A list of news articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 *       404:
 *         description: No news found or server error
 */

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get a news article by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The news ID
 *     responses:
 *       200:
 *         description: News article found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 */

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create a new news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       201:
 *         description: News article created
 *       404:
 *         description: Authorization failed or invalid data
 */

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news article by ID
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The news ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       202:
 *         description: News article updated
 *       404:
 *         description: News not found or authorization failed
 */

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news article by ID
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The news ID
 *     responses:
 *       200:
 *         description: News article deleted
 *       404:
 *         description: News not found or authorization failed
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         desc:
 *           type: string
 *         banner:
 *           type: string
 */
