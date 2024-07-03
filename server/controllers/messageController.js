import MessageModel from '../models/MessageModel.js'
import UserModel from '../models/UserModel.js'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

export const getAllMessagesInChat = async (req, res) => {
    try {
        const { chatId } = req.params
        const messages = await MessageModel.find({ chat: chatId })
            .populate('sender', 'name profilePicture')
            .populate('chat')
            .select('sender receiver content chat') // Explicitly selecting fields

        res.status(201).json(messages)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

export const createMessage = async (req, res) => {
    try {
        const { content } = req.body
        const { chatId } = req.params

        if (!content || !chatId) {
            return res.status(404).json({ error: 'All fields must be filled' })
        }

        var newMessage = await MessageModel.create({
            sender: req.user._id,
            content,
            chat: chatId,
        })

        newMessage = await newMessage.populate('sender', 'name profilePicture')
        newMessage = await newMessage.populate('chat')
        newMessage = await newMessage.populate('chat')
        newMessage = await UserModel.populate(newMessage, {
            path: 'chat.members',
            select: 'name profilePicture',
        })

        res.status(201).json(newMessage)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

export const getMostInteractions = async (req, res) => {
    try {
        const user = req.user
        const userId = new ObjectId(req.user._id)

        // console.log('query: ', req.query)
        const { startDate, endDate } = req.query

        if (!startDate || !endDate) {
            return res
                .status(400)
                .json({ error: 'Start date and end date are required' })
        }

        const friendIds = user.friendIds.map((id) => new ObjectId(id))

        const topFriendsAgg = [
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { sender: userId },
                                { receiver: userId },
                                { receivers: { $in: [userId] } },
                            ],
                        },
                        {
                            createdAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate),
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    otherUser: {
                        $cond: {
                            if: { $eq: ['$sender', userId] },
                            then: '$receivers',
                            else: ['$sender'],
                        },
                    },
                },
            },
            {
                $unwind: '$otherUser',
            },
            {
                $match: {
                    otherUser: { $in: friendIds },
                },
            },
            {
                $group: {
                    _id: '$otherUser',
                    messageCount: { $sum: 1 },
                },
            },
            {
                $sort: { messageCount: -1 },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'friend',
                },
            },
            {
                $unwind: '$friend',
            },
            {
                $project: {
                    _id: 0,
                    friendId: '$_id',
                    friendName: '$friend.name',
                    messageCount: 1,
                },
            },
        ]

        const topFriends = await MessageModel.aggregate(topFriendsAgg)

        return res.status(200).json(topFriends)
        // return res.status(200).json({ startDate, endDate })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}
