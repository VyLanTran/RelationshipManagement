import FriendRequestModel from '../models/FriendRequestModel.js'
import FriendshipModel from '../models/FriendshipModel.js'
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
        const receiver = await UserModel.findById(receiverId)
        if (!receiver) {
            res.status(404).json({ error: 'No such receiver exists' })
        }
        const request = await FriendRequestModel.create({
            senderId: req.user._id,
            receiverId: receiverId,
        })

        res.status(201).json(request)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

export const deleteFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.params

        const request = await FriendRequestModel.findOneAndDelete({
            sender: req.user._id,
            receiver: receiverId,
        })

        if (!request) {
            return res
                .status(404)
                .json({ error: 'No such friend request exists' })
        }
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

        // Check if a friendship already exists between the sender and receiver
        const existingFriendship = await FriendshipModel.findOne({
            $or: [
                { user1: request.sender, user2: request.receiver },
                { user1: request.receiver, user2: request.sender },
            ],
        })

        if (existingFriendship) {
            // Update the establishedAt field to the current date
            existingFriendship.establishedAt = new Date()
            await existingFriendship.save()
        } else {
            // Create a new friendship
            await FriendshipModel.create({
                user1: request.sender,
                user2: request.receiver,
                establishedAt: new Date(),
            })
        }

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
