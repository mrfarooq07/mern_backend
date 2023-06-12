const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
dotenv.config();
const app = express();
connectDB();
const userRoutes = require("./routes/userRoutes");
app.use(express.json()); //to accept JSON data

app.get("/", (req, res) => {
  res.send("First API call hit");
});

app.use("/api/user", userRoutes);

const port = process.env.PORT || 8888;

app.listen(8888, console.log(`server started on port ${port}`));

//tutorial link
//https://www.youtube.com/watch?v=ypJqtQ3xr7M&list=PLKhlp2qtUcSZsGkxAdgnPcHioRr-4guZf&index=5
