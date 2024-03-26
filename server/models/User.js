import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            requied: true
        }, 
        password: {
            type: String,
            require: true,
        }
    },
    {timestamps: true}
)

const User = mongoose.model('User', UserSchema)
export default User;