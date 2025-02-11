import { Student } from "../../model/Student.js";
import { HTTPError } from "../../helpers/index.js";

const getMedData = async (req, res) => {
    const { schoolId } = req.params; 
    console.log(req.params);
    if (!schoolId) {
        throw HTTPError(403, "Access denied");
    }

    const data = await Student.find({ schoolId });
    // console.log("data:", data);

    if (!data.length) {
        throw HTTPError(404, "Not Found");
    }

    res.json(data);
};

export default getMedData;