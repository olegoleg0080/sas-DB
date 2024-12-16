import express from "express";
import medControllers from "../controllers/med-controllers.js";
import autorization from "../medellwares/autorization.js";
// import autorization from "../medellwares/autorization.js";
const medRouter = express.Router();

medRouter.get("/get", autorization, medControllers.getMedData);
medRouter.get("/getById/:id", autorization, medControllers.getById);
medRouter.post("/update/:id", autorization, medControllers.updateStudentData);
medRouter.get("/generate-excel/:filterKey/:filterValue/:specificClass?", autorization, medControllers.generateFilteredExcel);

export default medRouter;
