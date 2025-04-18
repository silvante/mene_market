const express = require("express");
const {
  getUser,
  getUsers,
  addUser,
  editUser,
  deleteUser,
  verifyOTP,
  resendOTP,
  createWorkerAccount,
  getAllWorkers,
  getAllAdmins,
  getAllCourier,
  getAllOperators,
} = require("../controllers/user.controller");
const router = express.Router();

// get all users
router.get("/", getUsers);

// get user by ID
router.get("/:id", getUser);

// create user
router.post("/", addUser);

// edit user by id
router.put("/:id", editUser);

// delete user by id
router.delete("/:id", deleteUser);

router.post("/verifyOTP", verifyOTP);

router.post("/resendOTP", resendOTP);

// only owner can create workers
router.post("/worker", createWorkerAccount);

// gets all workers
router.get("/workers/all", getAllWorkers);

// gets only admins
router.get("/workers/admin", getAllAdmins);

// gets only couriers
router.get("/workers/courier", getAllCourier);

// gets only operators
router.get("/workers/operator", getAllOperators);

module.exports = router;

// Swagger documentation for User routes
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *       404:
 *         description: Email or username already in use
 */

/**
 * @swagger
 * /api/users/worker:
 *   post:
 *     summary: Create a new worker, only owner can
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *       404:
 *         description: Email or username already in use
 */

// Swagger documentation for User routes
/**
 * @swagger
 * /api/users/workers/all:
 *   get:
 *     summary: Retrieve a list of workers
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 */

// Swagger documentation for User routes
/**
 * @swagger
 * /api/users/workers/admin:
 *   get:
 *     summary: Retrieve a list of admins
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 */

// Swagger documentation for User routes
/**
 * @swagger
 * /api/users/workers/courier:
 *   get:
 *     summary: Retrieve a list of couriers
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 */

// Swagger documentation for User routes
/**
 * @swagger
 * /api/users/workers/operator:
 *   get:
 *     summary: Retrieve a list of operators
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       202:
 *         description: User updated
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       203:
 *         description: User deleted
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/verifyOTP:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /api/users/resendOTP:
 *   post:
 *     summary: Resend OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */
