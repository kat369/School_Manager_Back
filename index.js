const express = require("express");
const db = require("./db/connect");
const app = express();
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
require("dotenv").config();
db();
app.use(express.json());
const cors = require("cors");
app.use(cors("*"));

const PORT = process.env.PORT;
app.get("/", (request, response) => {
  response.send("Welcome to Task Management Application");
});

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.listen(PORT, () => {
    console.log(`The app is running in the port ${PORT}`);
  });