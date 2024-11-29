import {ctrlWrapper} from "../decorators/index.js";
import getById from "./medData/getById.js";
import { getMedData, updateStudentData } from "./medData/index.js";
export default {
    getMedData: ctrlWrapper(getMedData),
    getById: ctrlWrapper(getById),
    updateStudentData: ctrlWrapper(updateStudentData),
};
