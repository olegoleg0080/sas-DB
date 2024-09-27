import { model, Schema } from "mongoose";
import { handleSaveError, preUpdate } from "../hooks/hooks.js";
const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const authSchema = new Schema({
    userName: {
        type: String,
        minLength: 1,
        maxLength: 32,
        required: [true, "Username must be"],
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, "Password must be"],
    },
    email: {
        type: String,
        match: emailReg,
        unique: true,
        required: [true, "Email must be"],
    },
    token:{
        type:String,
        default:""
    }
}, {versionKey: false, timestamps: true});

authSchema.post("save", handleSaveError);
authSchema.pre("findOneAndUpdate", preUpdate);
authSchema.post("findOneAndUpdate", handleSaveError);

export const User = model("user", authSchema);
