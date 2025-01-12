require("dotenv").config()
const mongoose = require("mongoose")
const User = require("./models/user.model")
const bcryptjs = require("bcryptjs");
const cyfer = bcryptjs.genSaltSync(8);


const seedUsers = async () => {
    try {
        const owner = await User.findOne({status: "owner"})
        if (owner) {
            await User.deleteMany()
            const users = [
                { name: "Owner of Market", username: "owner", email: "owner@mmarket.com", password: bcryptjs.hashSync(process.env.OWNER_PASSWORD, cyfer), verificated: true, status: "owner" },
                { name: "Assembler", username: "assembler", email: "asm@we.com", password: bcryptjs.hashSync(process.env.OWNER_PASSWORD, cyfer), verificated: true, status: "owner" }
            ]
            await User.insertMany(users)
            console.log("Seeded users successfully!");
        } else {
            console.log("Owners already found!");
        }
    } catch (err) {
        console.log(`user seeding error ${err}`);
    }
}

const runSeeds = async () => {
  await mongoose.connect(process.env.DB);
  await seedUsers();
  mongoose.connection.close();
};

runSeeds();