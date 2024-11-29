import { Student } from "../../model/Student.js"
import {HTTPError} from "../../helpers/index.js"
const getMedData = async (req, res)=>{
    
    const data = await Student.find()
    
    if (!data) {
        throw HTTPError(404, "Not Faund")
    }
    
    res.json(data)
}
export default getMedData