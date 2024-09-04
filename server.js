const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

connectMongoos();

async function connectMongoos() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect Successfuly...");
    app.listen(PORT, () => {
      console.log("Server Running on port " + PORT);
    });
  } catch (error) {
    console.log("there is a error :" + error);
  }
}
