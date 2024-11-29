import express from "express";
import authControllers from "../controllers/auth-controllers.js";
const authRouter = express.Router();

authRouter.post("/signup", authControllers.signUp);
authRouter.post("/signin", authControllers.signIn);


export default authRouter;
