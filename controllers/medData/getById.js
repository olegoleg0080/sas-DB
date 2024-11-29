import HTTPError from "../../helpers/HTTPError.js";
import { Student } from "../../model/Student.js";

const getById = async (req, res) => {
    const studentId = req.params.id;
    
    console.log(studentId);
    

    const result = await Student.findOne({_id:studentId});
    if (!result) {
        throw HTTPError(404, `Can not find a people with id ${studentId}`)
    }
    res.json(result);
};

export default getById;
