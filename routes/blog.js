const express = require("express");
const {
  getBlogs,
  getBlogById,
  createBlog,
  editBlog,
  deleteBlog,
} = require("../controllers/blog.controller");
const router = express.Router();

router.get("/", getBlogs);

router.get("/:id", getBlogById);

router.post("/", createBlog);

router.put("/:id", editBlog);

router.delete("/:id", deleteBlog);

module.exports = router;

// Swagger documentation for Blog routes
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Retrieve a list of blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: A list of blog articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       404:
 *         description: No blogs found or server error
 */

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a blog article by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: Blog article found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog article
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: Blog article created
 *       404:
 *         description: Authorization failed or invalid data
 */

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog article by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       202:
 *         description: Blog article updated
 *       404:
 *         description: Blog not found or authorization failed
 */

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog article by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: Blog article deleted
 *       404:
 *         description: Blog not found or authorization failed
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
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
 *         link_to:
 *           type: string
 */
