const express = require("express");
const router = express.Router();
const {
  getComment,
  getComments,
  sendComment,
  editComment,
  deleteComment,
  getProductsComments,
} = require("../controllers/comment.controller");

router.get("/", getComments);
router.get("/:id", getComment);
router.get("/product/:product_id", getProductsComments)
router.post("/:product_id", sendComment);
// router.put("/:id", editComment);
router.delete("/:id", deleteComment);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing product comments
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve all comments from the database.
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 *       404:
 *         description: No comments found
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get a specific comment
 *     description: Retrieve a comment by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/comments/product/{product_id}:
 *   get:
 *     summary: Get a comments specific product
 *     description: Get a comments specific product by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/comments/{product_id}:
 *   post:
 *     summary: Create a new comment for a product
 *     description: Add a comment to a specific product.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         description: ID of the Product to Comment
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Great product!"
 *               commentor:
 *                 type: string
 *                 example: "User123"
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               gender:
 *                 type: string
 *                 example: "female"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request or server error
 */

// /**
//  * @swagger
//  * /api/comments/{id}:
//  *   put:
//  *     summary: Edit a comment
//  *     description: Edit an existing comment by its ID.
//  *     tags: [Comments]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID of the comment to edit
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               comment:
//  *                 type: string
//  *                 example: "Updated comment text."
//  *               rating:
//  *                 type: number
//  *                 example: 4.0
//  *               gender:
//  *                 type: string
//  *                 example: "male"
//  *     responses:
//  *       201:
//  *         description: Comment updated successfully
//  *       400:
//  *         description: Bad request or server error
//  */

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment by its ID.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
