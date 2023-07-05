require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 8000;

// 환경변수로부터 MongoDB URI 불러와서 연결하기
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("몽고디비 연결에 성공했습니다."))
  .catch(e => console.error(e));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에 성공적으로 연결되었습니다.`);
});
