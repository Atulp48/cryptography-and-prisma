const express = require("express");
const app = express();
const userRoutes = require("./src/routes/user.route.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", userRoutes);
app.get("/", (req, res) => {
  {
    res.send("welcome to my server");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
