import express from 'express'
import { verifyAuth } from '../middleware/auth.js'

import {
    createFriendRequest,
    getReceivedRequests,
    getSentRequests,
} from '../controllers/friendRequestController.js'

const router = express.Router()

router.use(verifyAuth)

router.get('/sent', getSentRequests)
router.get('/', getReceivedRequests)
router.post('/:receiverId', createFriendRequest)

export default router
