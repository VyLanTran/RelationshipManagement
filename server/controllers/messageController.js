import MessageModel from '../models/MessageModel.js'
import UserModel from '../models/UserModel.js'

export const getAllMessagesInChat = async (req, res) => {
  try {
    const { chatId } = req.params
    const messages = await MessageModel.find({ chat: chatId })
      // populate the sender with firstName, lastName, profilePicture
      .populate('sender', 'firstName lastName profilePicture')
      .populate('chat')

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

    newMessage = await newMessage.populate(
      'sender',
      'firstName lastName profilePicture'
    )
    newMessage = await newMessage.populate('chat')
    newMessage = await newMessage.populate('chat')
    newMessage = await UserModel.populate(newMessage, {
      path: 'chat.members',
      select: 'firstName lastName profilePicture',
    })

    res.status(201).json(newMessage)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
