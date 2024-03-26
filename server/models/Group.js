import mongoose from 'mongoose';
import User from 'User.js';

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        members: [{
            type: Schema.Types.ObjectId, 
            ref: User
        }]
    },
    {timestamps: true}
)

const Group = mongoose.model('Group', GroupSchema)
export default Group;