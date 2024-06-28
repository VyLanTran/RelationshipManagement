import FriendRequestModel from '../models/FriendRequestModel.js'
import FriendshipModel from '../models/FriendshipModel.js'
import UserModel from '../models/UserModel.js'

export const getAllPossibleSuggestions = async (req, res) => {
    try {
        const myself = req.user
        if (!myself) {
            return res.status(404).json({ error: 'Authentication required' })
        }

        const nonFriends = await UserModel.find({
            _id: { $nin: [...myself.friendIds, myself._id] }, // don't include myself
        }).select('-password')

        const receivedRequests = await FriendRequestModel.find({
            receiver: req.user._id,
        }).populate('sender', 'name profilePicture')
        const sentRequests = await FriendRequestModel.find({
            sender: req.user._id,
        }).populate('receiver', 'name profilePicture')

        const sentRequestReceiverIds = new Set(
            sentRequests.map((req) => req.receiver._id)
        )
        const receivedRequestSenderIds = new Set(
            receivedRequests.map((req) => req.sender._id)
        )

        // Filter nonFriends to exclude those in sent requests
        let allSuggestions = nonFriends.filter(
            (nonFriend) => !sentRequestReceiverIds.has(nonFriend._id)
        )

        // Add 'pending' field to each suggestion
        allSuggestions = allSuggestions.map((suggestion) => ({
            ...suggestion.toObject(),
            pending: receivedRequestSenderIds.has(suggestion._id.toString()),
        }))

        res.status(201).json(allSuggestions)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

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
        const receiverObj = await UserModel.findById(receiverId)
        if (!receiverObj) {
            res.status(404).json({ error: 'No such receiver exists' })
        }
        const newRequest = await FriendRequestModel.create({
            sender: req.user._id,
            receiver: receiverId,
        })

        const request = await FriendRequestModel.findOne({
            _id: newRequest._id,
        }).populate('sender', 'name profilePicture')

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
        const { senderId } = req.params

        const request = await FriendRequestModel.findOne({
            receiver: req.user._id,
            sender: senderId,
        })

        if (!request) {
            return res
                .status(404)
                .json({ error: 'No such friend request exists' })
        }

        // Check if the current user is the receiver of the request
        // if (String(req.user._id) !== String(request.receiver)) {
        //     return res.status(403).json({
        //         error: 'You are not authorized to accept this request',
        //     })
        // }

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
        const deletedRequest = await FriendRequestModel.findByIdAndDelete(
            request._id
        )

        res.status(200).json(
            //     {
            //     senderId: request.sender,
            //     receiverId: request.receiver,
            // }
            deletedRequest
            // sender
        )
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}
