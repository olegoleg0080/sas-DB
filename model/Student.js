import { model, Schema } from "mongoose";
import { handleSaveError, preUpdate } from "../hooks/hooks.js";

const MedDataSchema = new Schema(
    {
        paralel: {
            type: Number,
            required: true,
        },
        class: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        group: {
            type: String,
            required: true,
            enum: ["group1", "group2", "group3", "group4"],
        },
        vac: {
            type: String,
            required: true,
            enum: ["vac1", "vac2"],
        },
    },
    { versionKey: false }
);

MedDataSchema.post("save", handleSaveError);
MedDataSchema.pre("findOneAndUpdate", preUpdate);
MedDataSchema.post("findOneAndUpdate", handleSaveError);
export const Student = model("student", MedDataSchema);
