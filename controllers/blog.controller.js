const Blog = require("../models/blog.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) {
      res.status(404).json({ message: "server error or we have no blogs" });
    }
    res.status(200).send(blogs);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ message: "blog is not defined" });
    }
    res.status(200).send(blog);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const createBlog = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin" || user_doc.status == "owner") {
          try {
            const { title, desc, banner, link_to } = req.body;
            const blog = await Blog.create({
              title,
              desc,
              banner,
              link_to,
            });
            if (!blog) {
              res.status(404).json({ message: "something went wrong!" });
            }
            res.status(200).json(blog);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const editBlog = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin" || user_doc.status == "owner") {
          try {
            const id = req.params.id;
            const { title, desc, banner, link_to } = req.body;
            await Blog.findByIdAndUpdate(id, {
              title,
              desc,
              banner,
              link_to,
            }).then((up_pr) => {
              if (!up_pr) {
                res.status(404).json({ message: "something went wrong!" });
              }
              res.status(200).json({ message: "edited!" });
            });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin" || user_doc.status == "owner") {
          try {
            const id = req.params.id;
            await Blog.findByIdAndDelete(id).then((deleted) =>
              deleted
                ? res.status(200).json({ message: "deleted!" })
                : res.status(404).json({ message: "something went wrong!" })
            );
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports = { getBlogById, getBlogs, createBlog, editBlog, deleteBlog };
