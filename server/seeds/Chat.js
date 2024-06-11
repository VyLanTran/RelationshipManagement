import { faker } from '@faker-js/faker'
import UserModel from '../models/UserModel.js'
import ChatModel from '../models/ChatModel.js'
import MessageModel from '../models/MessageModel.js'
import {
    capitalizeFirstLetter,
    generateRandomNum,
    getRandomElementsFromArray,
} from './utils.js'
import { GROUP_SIZE_RATIO } from './constants.js'

export const generateRandomChatsAndMessages = async (
    numChats,
    privateChatRatio,
    numMessages
) => {
    if (
        numChats <= 0 ||
        privateChatRatio < 0 ||
        privateChatRatio > 1 ||
        numMessages <= 0
    ) {
        throw new Error('Invalid input parameters')
    }

    try {
        console.log(
            '========== Generating fake chats and messages... =========='
        )

        // Fetch all users
        const users = await UserModel.find({})
        if (users.length < 2) {
            throw new Error('Not enough users to create chats')
        }

        const numPrivateChats = Math.floor(numChats * privateChatRatio)
        const numGroupChats = numChats - numPrivateChats

        const chats = []

        // Create private chats
        for (let i = 0; i < numPrivateChats; i++) {
            const members = getRandomElementsFromArray(users, 2)
            const chat = new ChatModel({
                chatName: `Private Chat ${i + 1}`,
                isGroupChat: false,
                members: members.map((user) => user._id),
            })
            chats.push(chat)
        }

        // Create group chats
        for (let i = 0; i < numGroupChats; i++) {
            const members = getRandomElementsFromArray(
                users,
                generateRandomNum(3, users.length * GROUP_SIZE_RATIO)
            )
            const admin = members[generateRandomNum(0, members.length - 1)]
            const chat = new ChatModel({
                chatName: generateGroupName(),
                isGroupChat: true,
                admin: admin._id,
                members: members.map((user) => user._id),
            })
            chats.push(chat)
        }

        // Save chats to the database
        const savedChats = await ChatModel.insertMany(chats)
        console.log(
            `========== COMPLETE - ${savedChats.length}/${numChats} chats generated ==========`
        )

        // Generate messages for each chat
        for (const chat of savedChats) {
            await generateMessagesForChat(chat, numMessages)
        }

        console.log(
            '========== COMPLETE - Fake chats and messages generated =========='
        )
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
}

const generateMessagesForChat = async (chat, numMessages) => {
    const messages = []
    for (let i = 0; i < numMessages; i++) {
        const sender =
            chat.members[generateRandomNum(0, chat.members.length - 1)]
        const receivers = chat.members.filter(
            (member) => !member.equals(sender)
        )
        const message = new MessageModel({
            sender,
            receiver: receivers,
            content: await generateRandomQuote(),
            chat: chat._id,
        })
        messages.push(message)
    }
    await MessageModel.insertMany(messages)
}

const generateGroupName = () => {
    const adjective = faker.word.adjective()
    const noun = faker.word.noun()
    return `${capitalizeFirstLetter(adjective)} ${capitalizeFirstLetter(noun)}`
}

const generateRandomQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random')
        const data = await response.json()
        const randomSentence = data.content
        return randomSentence
    } catch (error) {
        console.error('Error fetching random sentence:', error)
        return 'Default Group Name'
    }
}
