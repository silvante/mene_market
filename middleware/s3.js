const AWS = require("aws-sdk")

const spacesEndpoint = new AWS.Endpoint("https://menemarket.nyc3.digitaloceanspaces.com")

const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
    region: "nyc3"
})

module.exports = s3