import mongoose from 'mongoose'

const FriendRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

const FriendRequestModel = mongoose.model('FriendRequest', FriendRequestSchema)
export default FriendRequestModel
