const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const SocketServer = require("./socketServer");

require("dotenv").config({
  path: "./configs/.env",
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//kết nối với database
// const db = require("./configs/key").mongoURI;
const db = "mongodb://localhost:27017/DATT";

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected...."))
  .catch((err) => console.log(err));

app.use(express.static("./serverUI"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./serverUI/index.html"));
});

// Socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  SocketServer(socket);
});

app.use("/api/account", require("./routers/Account"));
app.use("/api/follow", require("./routers/Follow"));
app.use("/api/post", require("./routers/Post"));
app.use("/api/heart", require("./routers/Heart"));
app.use("/api/comment", require("./routers/Comment"));
app.use("/api/heartcomment", require("./routers/HeartComment"));
app.use("/api/replycomment", require("./routers/ReplyComment"));
app.use("/api/savePost", require("./routers/SavePost"));
app.use("/api/notify", require("./routers/Notify"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 8000;
http.listen(PORT, console.log(`Server Run With Port ${PORT}`));
