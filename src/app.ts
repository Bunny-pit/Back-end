import express from "express";
import userRouter from "./routers/user";

const app = express();

app.use("/users", userRouter);

app.listen(4000, () => {
  console.log("Server is running on port 3000");
});
