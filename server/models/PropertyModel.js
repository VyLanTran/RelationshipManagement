import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
    {
        admin: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        name: {
            type: String,
            required: true
        },
        information: {
            type: String
        }
    }
)

const PropertyModel = mongoose.model("Property", PropertySchema);
export default PropertyModel;