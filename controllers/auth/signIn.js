import HTTPError from "../../helpers/HTTPError.js";
import { User } from "../../model/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const {JWT_SECRET} = process.env;
const signin = async (req, res) => {
    const {email, password } = req.body;
    const user = await User.findOne({email})
    if(!user){
        throw HTTPError(401, "Email or password invalid")
    }
    
    const comPass = bcrypt.compare(password, user.password)
    if(!comPass){
        throw HTTPError(401, "Email or password invalid")
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"})

    await User.findByIdAndUpdate(user._id, {token})
    res.status(201).json({
        token,
        user: {
            email,
            id: user._id,
            userName: user.userName
        }
    })
};

export default signin;
