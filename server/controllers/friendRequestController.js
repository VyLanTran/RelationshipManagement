import FriendRequestModel from '../models/FriendRequestModel.js'

// Get all friend requests sent to me
export const getReceivedRequests = async (req, res) => {
    try {
        const requests = await FriendRequestModel.find({
            receiver: req.user._id,
        }).populate('sender', 'name profilePicture')

        res.status(201).json(requests)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

// Get all friend requests sent by me
export const getSentRequests = async (req, res) => {
    try {
        const requests = await FriendRequestModel.find({
            sender: req.user._id,
        }).populate('receiver', 'name profilePicture')

        res.status(201).json(requests)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

export const createFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.params
        const request = await FriendRequestModel.create({
            sender: req.user._id,
            receiver: receiverId,
        })

        res.status(201).json(request)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}
