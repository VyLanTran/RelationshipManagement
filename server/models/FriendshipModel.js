import mongoose from 'mongoose'

const FriendshipSchema = new mongoose.Schema(
    {
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // this can be made up (different from timestamps) for reasonable data
        establishedAt: {
            type: Date,
            default: Date.now,
        },
        dissolvedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
)

// Define compound index to ensure uniqueness of friendships between pairs of users
FriendshipSchema.index({ user1: 1, user2: 1 }, { unique: true })

const FriendshipModel = mongoose.model('Friendship', FriendshipSchema)
export default FriendshipModel
