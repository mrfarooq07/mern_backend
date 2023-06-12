const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("First API call hit");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  console.log(req.params.id);
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const port = process.env.PORT || 8888;

app.listen(8888, console.log(`server started on port ${port}`));

//tutorial link
//https://www.youtube.com/watch?v=ypJqtQ3xr7M&list=PLKhlp2qtUcSZsGkxAdgnPcHioRr-4guZf&index=5
