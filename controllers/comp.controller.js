const Comp = require("../models/comp.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");

const createComp = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        try {
          if (user_doc.status == "admin") {
            const { title, desc, banner, min_length, places } = req.body;
            const id = req.params.id;
            const new_comp = await Comp.create({
              product_id: id,
              title,
              desc,
              banner,
              min_length,
              places,
            });
            if (!new_comp) {
              res.status(404).json({ message: "server error" });
            }
            res.status(200).json(new_comp);
          } else {
            res
              .status(404)
              .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
          }
        } catch (err) {
          console.log(err);
          res.send(err);
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

module.exports = { createComp };
