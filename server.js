const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => console.log("Database Connected Successfully✅✅"))
  .catch((err) => console.log(err.message));

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is Starting, see port 8000...");
});
