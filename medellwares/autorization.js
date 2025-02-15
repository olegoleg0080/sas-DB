import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { HTTPError } from "../helpers/index.js";
import { User } from "../model/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET } = process.env;



export const autorization = async (req, res, next) => {
    const { authorization } = req.headers;
    console.log("req.headers:", req.headers);
    
    // console.log("req.headers:", req.headers,"rec.body:", req.body);
    
    if (!authorization) {
        throw HTTPError(401, "Unauthorized");
    }
    const [baerer, token] = authorization.split(" ");
    if (baerer !== "Bearer") {
        throw HTTPError(401, "Autorization header mus b 'Bearer'");
    }
    try {
        console.log("token:", token);
        
        const { id } = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(id);
        console.log("user:", user);
        
        if (!user || !user.token || user.token !== token) {
            // console.log(user.token === token);

            throw HTTPError(401, "User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        throw HTTPError(401, error.message);
    }
};

export default ctrlWrapper(autorization);
