const cron = require("node-cron");
const clean_the_ocean = require("../middleware/ocean_cleaner");

cron.schedule("0 2 * * *", async () => {
  console.log(`${Date.now()}::process getting started ----->`);
  await clean_the_ocean();
});

// why not working