import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";


//라우터 import
import mainhomeRouter from "./src/routers/Mainhome_router.js";
import userRouter from "./src/routers/user_router.js"

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("몽고디비 연결에 성공했습니다."))
  .catch(e => console.error(e));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routesPath = path.join(__dirname, "src", "routers");
const files = fs.readdirSync(routesPath);

app.get("/", (req, res) => {
  res.send("여기는 버니톡의 백엔드 페이지입니다!");
});

//여기에 라우터 app.use 작성하기
app.use("/api/mainhome", mainhomeRouter);
app.use("/api/user", userRouter);


Promise.all(
  files.map(async file => {
    if (file.endsWith(".js") && file !== "Mainhome_router.js") {
      const route = await import(path.join("file://", routesPath, file));
      app.use(route.default);
    }
  }),
).then(() => {
  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에 성공적으로 연결되었습니다.`);
  });
});
