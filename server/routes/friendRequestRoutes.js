import express from 'express'
import { verifyAuth } from '../middleware/auth.js'

import {
    acceptFriendRequest,
    createFriendRequest,
    deleteFriendRequest,
    getAllPossibleSuggestions,
    getReceivedRequests,
    getSentRequests,
} from '../controllers/friendRequestController.js'

const router = express.Router()

router.use(verifyAuth)

router.get('/allSuggestions', getAllPossibleSuggestions)
router.get('/sent', getSentRequests)
router.get('/received', getReceivedRequests)
router.post('/accept/:senderId', acceptFriendRequest)
router.post('/:receiverId', createFriendRequest)
router.delete('/:receiverId', deleteFriendRequest)

export default router
