import FriendRequestModel from '../models/FriendRequestModel.js'
import FriendshipModel from '../models/FriendshipModel.js'
import UserModel from '../models/UserModel.js'
import neo4j from 'neo4j-driver'

const neo4jUrl = process.env.NEO4J_URI
const neo4jUser = process.env.NEO4J_USERNAME
const neo4jPassword = process.env.NEO4J_PASSWORD

const driver = neo4j.driver(
    neo4jUrl,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
)
const session = driver.session()

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

        const sentSet = new Set(
            sentRequests.map((req) => req.receiver._id.toString())
        )
        const receivedSet = new Set(
            receivedRequests.map((req) => req.sender._id.toString())
        )

        const sentArray = Array.from(sentSet)
        const receivedArray = Array.from(receivedSet)

        // Filter nonFriends to exclude those in sent requests or received requests
        let allSuggestions = nonFriends.filter(
            (nonFriend) =>
                !sentArray.includes(nonFriend._id.toString()) &&
                !receivedArray.includes(nonFriend._id.toString())
        )

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

export const unsendFriendRequest = async (req, res) => {
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

export const declineFriendRequest = async (req, res) => {
    try {
        const { senderId } = req.params

        const request = await FriendRequestModel.findOneAndDelete({
            receiver: req.user._id,
            sender: senderId,
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

        // Update Neo4j
        await session.run(
            `MATCH (u1:User {id: $id1}), (u2:User {id: $id2})
            MERGE (u1)-[:FRIEND]->(u2)
            MERGE (u2)-[:FRIEND]->(u1)`,
            { id1: sender._id.toString(), id2: receiver._id.toString() }
        )

        res.status(200).json(deletedRequest)
    } catch (err) {
        res.status(404).json({ error: err.message })
    } finally {
        await session.close()
        await driver.close()
    }
}

// const unfriend
//  // Create a new friendship
// await FriendshipModel.create({
//     user1: request.sender,
//     user2: request.receiver,
//     establishedAt: new Date(),
// })
