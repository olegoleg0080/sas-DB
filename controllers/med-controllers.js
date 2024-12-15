import {ctrlWrapper} from "../decorators/index.js";
import generateFilteredExcel from "./medData/generateFileExcel.js";
import getById from "./medData/getById.js";
import { getMedData, updateStudentData } from "./medData/index.js";
export default {
    getMedData: ctrlWrapper(getMedData),
    getById: ctrlWrapper(getById),
    updateStudentData: ctrlWrapper(updateStudentData),
    generateFilteredExcel: ctrlWrapper(generateFilteredExcel),
};
