import {ctrlWrapper} from "../decorators/index.js";
import { getMedData, updateStudentData } from "./medData/index.js";
export default {
    getMedData: ctrlWrapper(getMedData),
    updateStudentData: ctrlWrapper(updateStudentData),
};
