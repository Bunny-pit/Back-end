import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  console.log("userRouter!!!");
  res.send("Hello, Users!");
});

export default router;
