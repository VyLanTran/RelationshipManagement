import express from 'express'
import { verifyAuth } from '../middleware/auth.js'

import {
  createMessage,
  getAllMessagesInChat,
} from '../controllers/messageController.js'

const router = express.Router()

router.use(verifyAuth)

router.get('/:chatId', getAllMessagesInChat)
router.post('/:chatId', createMessage)

export default router
