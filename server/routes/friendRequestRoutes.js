import express from 'express'
import { verifyAuth } from '../middleware/auth.js'

import {
    acceptFriendRequest,
    createFriendRequest,
    getReceivedRequests,
    getSentRequests,
} from '../controllers/friendRequestController.js'

const router = express.Router()

router.use(verifyAuth)

router.get('/sent', getSentRequests)
router.get('/received', getReceivedRequests)
router.post('/:receiverId', createFriendRequest)
router.put('/:requestId', acceptFriendRequest)

export default router
