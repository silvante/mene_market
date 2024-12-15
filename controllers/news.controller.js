const News = require("../models/news.model")
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../routes/extra")

const getNews = async (req, res) => {
    try {
        const news = News.find()
        if (!news) {
            res.status(404).json({ message: "server error or we have no news" })
        }
        res.status(200).send(news)
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

const getNewsById = async (req, res) => {
    try {
        const id = req.params.id
        const news = News.findById(id)
        if (!news) {
            res.status(404).json({ message: "new is not defined" })
        }
        res.status(200).send(news)
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

const createNews = async (req, res) => {
    try {
        const auth_headers = req.headers.authorization
        if (auth_headers && auth_headers.startsWith("Bearer ")) {
            const token = auth_headers.split("Bearer ")[1]

            jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
                if (err) {
                    throw err
                }

                if (user_doc.status == "admin") {
                    try {
                        const { title, desc, banner, link_to } = req.body
                        const news = await News.create({
                            title, desc, banner, link_to
                        })
                        if (!news) {
                            res.status(404).json({ message: 'something went wrong!' })
                        }
                        res.status(200).json(news)
                    } catch (err) {
                        console.log(err);
                        res.send(err)
                    }                    
                } else {
                    res.status(404).send("bu metoddan foidalanish uchun admin bolishingiz kerak")
                }
            })
        } else {
            res.status(404).send("no token provided")
        }
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

const editNews = async (req, res) => {
    try {
        const auth_headers = req.headers.authorization
        if (auth_headers && auth_headers.startsWith("Bearer ")) {
            const token = auth_headers.split("Bearer ")[1]

            jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
                if (err) {
                    throw err
                }

                if (user_doc.status == "admin") {
                    try {
                        const id = req.params.id
                        const { title, desc, banner, link_to } = req.body
                        await News.findByIdAndUpdate(id, {
                            title, desc, banner, link_to
                        }).then((up_pr) => {
                            if (!up_pr) {
                                res.status(404).json({ message: 'something went wrong!' })
                            }
                            res.status(200).json({ message: 'edited!' })
                        })
                    } catch (err) {
                        console.log(err);
                        res.send(err)
                    }
                } else {
                    res.status(404).send("bu metoddan foidalanish uchun admin bolishingiz kerak")
                }
            })
        } else {
            res.status(404).send("no token provided")
        }        
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

const deleteNews = async (req, res) => {
    try {
        const auth_headers = req.headers.authorization
        if (auth_headers && auth_headers.startsWith("Bearer ")) {
            const token = auth_headers.split("Bearer ")[1]

            jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
                if (err) {
                    throw err
                }

                if (user_doc.status == "admin") {
                    try {
                        const id = req.params.id
                        await News.findByIdAndDelete(id).then((deleted) => deleted ? res.status(200).json({ message: 'deleted!' }) : res.status(404).json({ message: 'something went wrong!' }))
                    } catch (err) {
                        console.log(err);
                        res.send(err)
                    }                    
                } else {
                    res.status(404).send("bu metoddan foidalanish uchun admin bolishingiz kerak")
                }
            })
        } else {
            res.status(404).send("no token provided")
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

module.exports = { getNews, getNewsById, createNews, editNews, deleteNews }