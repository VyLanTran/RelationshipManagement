import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        admin: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
        },
        content: {
            type: String,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        }
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
export default Event;
