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
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            require: true,
        },
        verified: {
            type: Boolean,
            default: false,
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
            default: function () {
                return {
                    // url: 'https://smccsydney.syd.catholic.edu.au/wp-content/uploads/sites/111/2019/05/Person-icon.jpg',
                    url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
                }
            },
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
        facebookId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
)

const UserModel = mongoose.model('User', UserSchema)
export default UserModel
