import express from "express";
import cors from "cors";
import medRouter from "./routes/med-router.js"
import authRouter from "./routes/auth-router.js"

const app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log("middleware");
  next();
});

app.use(express.json());

app.use("/medApi/data", medRouter)
app.use("/medApi/auth", authRouter)
app.get("/", (req, res) => {
  res.json("Hello World");
});

app.use((err, req, res, next) => {
    console.log("err", err);
    res.status(err.status).json({message: err.message})
})


export default app