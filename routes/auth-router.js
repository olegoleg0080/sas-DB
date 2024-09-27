import express from "express";
import authControllers from "../controllers/auth-controllers.js";
import autorization from "../medellwares/autorization.js";
const authRouter = express.Router();

authRouter.post("/signup", autorization, authControllers.signUp);
authRouter.post("/signin", autorization, authControllers.signIn);

export default authRouter;
