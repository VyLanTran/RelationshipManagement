import ChatModel from '../models/ChatModel.js'
import UserModel from '../models/UserModel.js'

export const getAllChats = async (req, res) => {
    try {
        const chats = await ChatModel.find({})
        res.status(200).json(chats)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/**
 * Get all chats in which I'm a member
 */
export const getAllMyChats = async (req, res) => {
    try {
        const chats = await ChatModel.find({
            members: { $in: [req.user._id] },
        })
            .populate('members') // add the whole data of each member (instead of just their id)
            .populate('admin')
            .sort({ updatedAt: -1 }) // sort from latest to oldest
        res.status(201).json(chats)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/**
 * route: /chats/search/?search={keyword}
 * given a keyword, return all chats such that:
 * we are a member
 * either chat name match
 * or some members has name, email, username match the keyword
 */
export const searchChats = async (req, res) => {
    try {
        const keyword = req.query.search
        const words = keyword.toLowerCase().split(/\s+/)

        const chats = await ChatModel.find({
            members: { $in: [req.user._id] },
        })
            .populate('members')
            .populate('admin')
            .sort({ updatedAt: -1 })

        const filteredChats = chats.filter((chat) => {
            return (
                isNameMatch(chat, words) ||
                chat.members.some((member) => isMemberMatch(member, words))
            )
        })

        let usersWithPrivateChat = new Set()

        // Modify the filteredChats to only include IDs for admin and members
        let simplifiedChats = []
        simplifiedChats = filteredChats.map((chat) => {
            if (!chat.isGroupChat) {
                chat.members.forEach((member) => {
                    usersWithPrivateChat.add(member._id.toString())
                })
            }

            return {
                _id: chat._id,
                chatName: chat.chatName,
                isGroupChat: chat.isGroupChat,
                admin: chat.admin
                    ? {
                          _id: chat.admin._id,
                          name: chat.admin.name,
                          profilePicture: chat.admin.picture,
                      }
                    : null,
                members: chat.members.map((member) => ({
                    _id: member._id,
                    name: member.name,
                    profilePicture: member.profilePicture,
                })),
                updatedAt: chat.updatedAt,
            }
        })

        // Find matching users who are friends but not already in a private chat
        const matchingUsersPromises = req.user.friendIds.map(
            async (friendId) => {
                const friend = await UserModel.findById(
                    friendId,
                    '_id name username email profilePicture'
                )

                if (
                    isMemberMatch(friend, words) &&
                    !usersWithPrivateChat.has(friendId.toString())
                ) {
                    return friend
                }
                return null
            }
        )

        // Await all promises and filter out null values
        let matchingUsers = []
        matchingUsers = (await Promise.all(matchingUsersPromises)).filter(
            (user) => user !== null
        )
        res.status(201).json({
            chats: simplifiedChats,
            users: matchingUsers,
        })
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

const isNameMatch = (chat, words) => {
    return words.some((word) => chat.chatName.toLowerCase().includes(word))
}

const isMemberMatch = (member, words) => {
    return words.some(
        (word) =>
            member.name.toLowerCase().includes(word) ||
            member.email.toLowerCase().includes(word) ||
            member.username.toLowerCase().includes(word)
    )
}

/**
 * Access a chat that you are a member of
 */
export const getChat = async (req, res) => {
    try {
        const { chatId } = req.params
        const userId = req.user._id
        const chat = await ChatModel.findOne({
            _id: chatId,
            members: { $elemMatch: { $eq: userId } },
        })
            .populate('members') // add the whole data of each member (instead of just their id)
            .populate('admin')
        if (!chat) {
            throw Error('You are not a member of this chat')
        }
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/**
 This is for private chat between 2 users
 If a chat already exists, get it
 Otherwise, create a new one
 */
export const getOrCreatePrivateChat = async (req, res) => {
    try {
        const { friendId } = req.body
        const myself = req.user
        const friend = await UserModel.findById(friendId)

        const chat = await ChatModel.find({
            isGroupChat: false,
            // two members of the chat must match
            $and: [{ members: { $all: [req.user._id, friendId] } }],
        })
            .populate('members')
            .populate('admin')

        let newChat

        // If the chat already exists, return it
        if (chat.length > 0) {
            // res.status(201).json(chat[0])
            newChat = chat[0]
        }
        // If no such chat, create one
        else {
            try {
                newChat = await ChatModel.create({
                    chatName: friend.name,
                    isGroupChat: false,
                    members: [myself._id, friendId],
                })
            } catch (error) {
                res.status(404).json({ error: error.message })
            }
        }

        const allChats = await ChatModel.find({
            members: { $in: [req.user._id] },
        })
            .populate('members') // add the whole data of each member (instead of just their id)
            .populate('admin')
            .sort({ updatedAt: -1 })
        res.status(201).json({
            allChats: allChats,
            currentChat: newChat,
        })
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

export const createGroupChat = async (req, res) => {
    try {
        const { chatName, memberIds } = req.body
        if (!chatName || !memberIds) {
            return res.status(404).json({ error: 'All fields must be filled' })
        }
        let parsedMembers = JSON.parse(memberIds)
        if (parsedMembers.length < 1) {
            return res.status(404).json({
                error: 'A group chat must contain at least 2 people (including yourself)',
            })
        }
        // Add ourself as a member of this group
        parsedMembers.push(req.user._id)

        // From frontend, we will design logic to avoid adding duplicated users, but I will just make it a unique array here as well
        let uniqueMembersSet = new Set(parsedMembers)
        parsedMembers = Array.from(uniqueMembersSet)

        // Create a new GroupModel instance
        const newChat = await ChatModel.create({
            chatName,
            isGroupChat: true,
            admin: req.user._id,
            members: parsedMembers,
        })

        const allChats = await ChatModel.find({
            members: { $in: [req.user._id] },
        })
            .populate('members') // add the whole data of each member (instead of just their id)
            .populate('admin')
            .sort({ updatedAt: -1 })
        res.status(201).json({
            allChats: allChats,
            currentChat: newChat,
        })
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

// any member can rename the group
export const renameChat = async (req, res) => {
    try {
        const { chatId } = req.params
        const userId = req.user._id
        const chat = await ChatModel.findOne({
            _id: chatId,
            members: { $elemMatch: { $eq: userId } },
        })
        if (!chat) {
            throw Error('You are not a member of this chat')
        }
        const { chatName } = req.body
        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            { new: true }
        )
            .populate('members')
            .populate('admin')
        res.status(201).json(updatedChat)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

/**
 * Any member of the group chat can add new members to the chat, MUST be group chat
 */
export const addMembers = async (req, res) => {
    try {
        const { chatId } = req.params
        const userId = req.user._id
        const chat = await ChatModel.findOne({
            _id: chatId,
            members: { $elemMatch: { $eq: userId } },
        })
        if (!chat) {
            throw Error('You are not a member of this chat')
        }
        if (!chat.isGroupChat) {
            throw Error('You cannot add members to a private chat')
        }

        let { memberIds } = req.body
        memberIds = JSON.parse(memberIds)

        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatId,
            {
                $addToSet: { members: { $each: memberIds } },
            },
            { new: true }
        )
            .populate('members')
            .populate('admin')
        res.status(201).json(updatedChat)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

/**
 * Only admin can remove members from group chat
 */
// TODO: what if after deleting, there are <= 2 people
export const removeMembers = async (req, res) => {
    try {
        const { chatId } = req.params
        const userId = req.user._id
        const chat = await ChatModel.findOne({
            _id: chatId,
            members: { $elemMatch: { $eq: userId } },
        })
        if (
            !chat ||
            (chat.admin && userId.toString() !== chat.admin._id.toString())
        ) {
            throw Error('Only admin can remove members from this group chat')
        }
        if (!chat.isGroupChat) {
            throw Error('You cannot remove members from a private chat')
        }

        let { memberIds } = req.body
        memberIds = JSON.parse(memberIds)

        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatId,
            {
                $pull: { members: { $in: memberIds } },
            },
            { new: true }
        )
            .populate('members')
            .populate('admin')
        res.status(201).json(updatedChat)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}
