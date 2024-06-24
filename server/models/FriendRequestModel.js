import mongoose from 'mongoose'

const FriendRequestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

const FriendRequestModel = mongoose.model('FriendRequest', FriendRequestSchema)
export default FriendRequestModel
