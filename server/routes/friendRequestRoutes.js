import express from 'express'
import { verifyAuth } from '../middleware/auth.js'

import {
    acceptFriendRequest,
    createFriendRequest,
    deleteFriendRequest,
    getReceivedRequests,
    getSentRequests,
} from '../controllers/friendRequestController.js'

const router = express.Router()

router.use(verifyAuth)

router.get('/sent', getSentRequests)
router.get('/received', getReceivedRequests)
router.post('/:receiverId', createFriendRequest)
router.delete('/:receiverId', deleteFriendRequest)
router.put('/:requestId', acceptFriendRequest)

export default router
