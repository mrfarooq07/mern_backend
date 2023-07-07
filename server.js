const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
dotenv.config();
const app = express();
connectDB();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleWare");
app.use(express.json()); //to accept JSON data

app.get("/", (req, res) => {
  res.send("First API call hit");
});

app.use("/api/user", userRoutes); //this is user register route
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8888;

const server = app.listen(port, console.log(`server started on port ${port}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");
});

//tutorial link
//https://www.youtube.com/watch?v=ypJqtQ3xr7M&list=PLKhlp2qtUcSZsGkxAdgnPcHioRr-4guZf&index=5
