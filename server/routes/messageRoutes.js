import express from 'express'
import { verifyAuth } from '../middleware/auth.js'

import {
    createMessage,
    getAllMessagesInChat,
    getMessageLastMonth,
    getMostInteractions,
} from '../controllers/messageController.js'

const router = express.Router()

router.use(verifyAuth)

router.get('/mostInteractions', getMostInteractions)
router.get('/lastMonth/:otherUserId', getMessageLastMonth)
router.get('/:chatId', getAllMessagesInChat)
router.post('/:chatId', createMessage)

export default router
