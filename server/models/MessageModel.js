import mongoose from 'mongoose'

const MessageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        content: {
            type: String,
            trim: true, // trim the redundant spaces at the beginning and end of message
        },
        // TODO: attachment and images
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
        },
    },
    {
        timestamps: true,
    }
)

const MessageModel = mongoose.model('Message', MessageSchema)
export default MessageModel
