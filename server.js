import app from "./app.js";
import mongoose from "mongoose";

const {DB_HOST} = process.env
console.log(DB_HOST);

mongoose.connect(DB_HOST).then(()=>{
  console.log("DB connect");
  app.listen(3001)
}).catch((error)=>{
console.log(error.message);
process.exit(1)
})