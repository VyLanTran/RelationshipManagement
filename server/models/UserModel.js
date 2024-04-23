import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        // TODO: email has to be unique
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            require: true,
        },
        company: {
            type: String,
            default: '',
        },
        school: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        hometown: {
            type: String,
            default: '',
        },
        currentCity: {
            type: String,
            default: '',
        },
        profilePicture: {
            type: Object,
            default: null,
        },
        coverPhoto: {
            type: Object,
            default: null,
        },
        friendIds: {
            type: Array, // array of userId of our friends
            default: [],
        },
        connectionIds: {
            type: Array,
            default: [],
        },
        // social media links
        facebookId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
)

const UserModel = mongoose.model('User', UserSchema)
export default UserModel
