require("dotenv").config();
const connection = require("./db");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
// const csurf = require("csurf");
const cors = require("cors");
const app = express();
const cluster = require("cluster");
const os = require("os");
const Category = require("./models/category.model.js");
const Product = require("./models/product.model.js");
const path = require("path");
app.use(express.static("public"));

app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// for swagger

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation of mene market",
      version: "1.0.0",
      description: "specially for mene market in 2024 and 2025",
    },
    servers: [
      {
        url: process.env.ORIGIN2,
      },
    ],
  },
  apis: ["./routes/*.js", "index.js"], // Path to API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.set("trust proxy", 1);

// limitter

const limitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. why to not take a brake for 15 minutes ?",
});

// defend

app.use(limitter);
app.use(helmet());
// app.use(csurf());

// cors

const allowedOrigins = [
  process.env.ORIGIN1,
  process.env.ORIGIN2,
  process.env.ORIGIN3,
  process.env.ORIGIN4,
  process.env.ORIGIN5,
  process.env.ORIGIN6,
  process.env.ORIGIN7,
  process.env.ORIGIN8,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// app.use(
//   cors({
//     origin: "*",
//   })
// );

connection();

// requiring routes

const { router } = require("./routes/extra");
const user = require("./routes/user");
const product = require("./routes/product");
const category = require("./routes/category");
const oqim = require("./routes/oqim");
const order = require("./routes/order");
const dbox = require("./routes/donatebox");
const donate = require("./routes/donate");
const news = require("./routes/news.js");
const blog = require("./routes/blog.js");
const comp = require("./routes/comp.js");
const payment = require("./routes/payment.js");
const comment = require("./routes/comment.js");
const upload = require("./routes/upload");

// using routes

app.use("/", router);
app.use("/api/users", user);
app.use("/api/products", product);
app.use("/api/categories", category);
app.use("/api/oqim", oqim);
app.use("/api/orders", order);
app.use("/api/dbox", dbox);
app.use("/api/donate", donate);
app.use("/api/news", news);
app.use("/api/blogs", blog);
app.use("/api/competitions", comp);
app.use("/api/payments", payment);
app.use("/api/comments", comment);
app.use("/files", upload);

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Listening on port ${PORT}...`));

// route

app.get("/crp", async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories

    const categoryData = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({
          $or: [
            { tags: category.title }, // Products where category title is in tags array
            { type: category.title }, // Products where type matches category title
          ],
        })
          .limit(20) // Limit to 20 products per category
          .sort({ created_at: -1 }); // Sort by newest products first

        return {
          category: category.title,
          products,
        };
      })
    );

    res.json(categoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/home", async (req, res) => {
  try {
    const latest_products = await Product.find()
      .sort({ created_at: -1 })
      .limit(40);
    const discount_products = await Product.find({
      $expr: { $gt: ["$discount_price", "$price"] },
    })
      .sort({ discount_price: -1 })
      .limit(40);
    const popular_products = await Product.find().sort({ sold: -1 }).limit(40);
    if (!popular_products || !latest_products || !discount_products) {
      return res.status(404).send("server error");
    }
    return res.status(200).json({
      latest_products: latest_products,
      discount_products: discount_products,
      popular_products: popular_products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

// Set the view engine to EJS
app.set("view engine", "ejs");

// Specify the directory for view files
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  try {
    res.render("index", {
      title: "mene-market server",
      message: "server side for web site mene-market!",
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// Swagger documentation for User routes
/**
 * @swagger
 * /crp:
 *   get:
 *     summary: All categories with 20 products max
 *     tags: [Categry Related Products]
 *     responses:
 *       200:
 *         description: List of products and categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: No users found
 */
/**
 * @swagger
 * /home:
 *   get:
 *     summary: gets products to display in home page
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: No users found
 */
// account by status

// now we have only
// sellers
// admins
// owner
// courier
// operator

// if (cluster.isMaster) {
//   const numCPUs = os.cpus().length;

//   console.log(`Master process ${process.pid} is running`);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // Restart workers if they die
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else {
//   // Worker processes handle HTTP requests
//   app.get('/', (req, res) => {
//     res.send(`Handled by worker ${process.pid}`);
//   });

//   app.listen(PORT, () => {
//     console.log(`Worker ${process.pid} running on port ${PORT}`);
//   });
// }
//
//
