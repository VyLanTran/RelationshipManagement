import FriendRequestModel from '../models/FriendRequestModel.js'
import UserModel from '../models/UserModel.js'

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
        const receiver = await User.findById(receiverId)
        if (!receiver) {
            res.status(404).json({ error: 'No such receiver exists' })
        }
        const request = await FriendRequestModel.create({
            sender: req.user._id,
            receiver: receiverId,
        })

        res.status(201).json(request)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params
        const request = await FriendRequestModel.findById(requestId)

        // Check if the current user is the receiver of the request
        if (String(req.user._id) !== String(request.receiver)) {
            return res.status(403).json({
                error: 'You are not authorized to accept this request',
            })
        }

        const sender = await UserModel.findById(request.sender)
        const receiver = await UserModel.findById(request.receiver)
        // update friend status of both users
        sender.friendIds.push(receiver._id)
        receiver.friendIds.push(sender._id)

        await sender.save({ new: true, validateModifiedOnly: true })
        await receiver.save({ new: true, validateModifiedOnly: true })

        // delete request
        await FriendRequestModel.findByIdAndDelete(requestId)

        res.status(200).json({
            senderId: request.sender,
            receiverId: request.receiver,
        })
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}