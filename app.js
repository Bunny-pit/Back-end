import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import logger from "winston";
import cors from "cors";
import passport from "passport";

//passport에 strategy 적용
import { applyPassportStrategy } from "./src/lib/passport.js";

//라우터 import
import MainhomeRouter from "./src/routers/Mainhome_router.js";
import userRouter from "./src/routers/user_router.js";

const app = express();

//express 탑재 body-parser 사용, cors 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//환경 설정
dotenv.config();
const port = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routesPath = path.join(__dirname, "src", "routers");
const files = fs.readdirSync(routesPath);

// route
app.get("/", (req, res) => {
  res.send("여기는 버니톡의 백엔드 페이지입니다!");
});
// API
app.use("/api/mainhome", MainhomeRouter);
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
    logger.info(`서버가 http://localhost:${port}에 성공적으로 연결되었습니다.`);
    mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => logger.info("몽고디비 연결에 성공했습니다."))
      .catch(e => console.error(e));
  });
});
