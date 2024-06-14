import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
    {
        admin: {
            type: String,
            ref: "Group"
        },
        name: {
            type: String,
            required: true
        },
        subject: {
            type: String
        }
    }
)

const PropertyModel = mongoose.model("Property", PropertySchema);
export default PropertyModel;