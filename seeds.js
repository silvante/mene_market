require("dotenv").config()
const mongoose = require("mongoose")
const User = require("./models/user.model")
const bcryptjs = require("bcryptjs");
const cyfer = bcryptjs.genSaltSync(8);


const seedUsers = async () => {
    try {
        await User.deleteMany()
        const users = [
            { name: "Owner of Market", username: "owner", email: "owner@mmarket.com", password: bcryptjs.hashSync(process.env.OWNER_PASSWORD, cyfer), verificated: true },
            { name: "Assembler", username: "assembler", email: "asm@we.com", password: bcryptjs.hashSync(process.env.OWNER_PASSWORD, cyfer), verificated: true }
        ]
        await User.insertMany(users)
        console.log("Seeded users successfully!");
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