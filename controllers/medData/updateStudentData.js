import { Student } from "../../model/Student.js";

const updateStudentData = async (req, res) => {
    const postId = req.params.id;
    const newPost = await Student.findOneAndUpdate(
        { _id: postId},
        { ...req.body }
    );
    if (!newPost) {
        res.status(400).send(`Can not find a post with id ${postId}`);
        return;
    }
    res.json(newPost);
};
export default updateStudentData;