import UserModel from '../models/UserModel.js'
import cloudinary from '../utils/cloudinary.js'

// GET
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.status(200).json(users)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await UserModel.findById(userId)
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

// Get friend list of a certain user
export const getAllFriends = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await UserModel.findById(userId)
        const friends = await Promise.all(
            user.friendIds.map((friendId) =>
                UserModel.findById(friendId).select(
                    'name email phone company school currentCity profilePicture posts'
                )
            )
        )
        res.status(200).json(friends)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

// Get all non-friends of us
export const getAllNonFriends = async (req, res) => {
    try {
        const myself = req.user
        if (!myself) {
            return res.status(404).json({ error: 'Authentication required' })
        }

        const nonFriends = await UserModel.find({
            _id: { $nin: [...myself.friendIds, myself._id] }, // don't include myself
        }).select('-password')

        res.status(200).json(nonFriends)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

// Search users with keyword
// route: /users/search/?search={keyword}
export const searchUsers = async (req, res) => {
    try {
        const keyword = req.query.search
        const words = keyword.toLowerCase().split(/\s+/)

        // Find all users with that keyword (except from ourself)
        // TODO: find those in our friend list only
        // TODO: create a json file of 100+ fake users for testing
        const users = await UserModel.find({
            _id: { $ne: req.user._id },
        })
        const filteredUsers = users.filter((user) => isMatch(user, words))

        res.status(201).json(filteredUsers)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

const isMatch = (user, words) => {
    return words.some(
        (word) =>
            user.name.toLowerCase().includes(word) ||
            user.email.toLowerCase().includes(word) ||
            user.username.toLowerCase().includes(word)
    )
}

// PATCH
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
                ...req.body,
            },
            {
                new: true,
                runValidators: true,
            }
        )

        return res.status(200).json(updatedUser)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const createProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id
        const { profilePicture } = req.body
        const uploadRes = await cloudinary.uploader.upload(profilePicture, {
            upload_preset: 'group4-preset',
        })
        if (uploadRes) {
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { profilePicture: uploadRes } },
                {
                    new: true,
                    runValidators: true,
                }
            )
            res.status(200).json(updatedUser)
        }
    } catch (err) {
        res.status(404).json({ mesage: err.message })
    }
}

export const createCoverPhoto = async (req, res) => {
    try {
        const userId = req.user._id
        const { coverPhoto } = req.body
        const uploadRes = await cloudinary.uploader.upload(coverPhoto, {
            upload_preset: 'group4-preset',
        })
        if (uploadRes) {
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { coverPhoto: uploadRes } },
                {
                    new: true,
                    runValidators: true,
                }
            )
            res.status(200).json(updatedUser)
        }
    } catch (err) {
        res.status(404).json({ mesage: err.message })
    }
}
