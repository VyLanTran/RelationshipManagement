import express from 'express'
import { verifyAuth } from '../middleware/auth.js'

import {
    acceptFriendRequest,
    createFriendRequest,
    declineFriendRequest,
    getAllPossibleSuggestions,
    getReceivedRequests,
    getSentRequests,
    unsendFriendRequest,
} from '../controllers/friendRequestController.js'

const router = express.Router()

router.use(verifyAuth)

router.get('/allSuggestions', getAllPossibleSuggestions)
router.get('/sent', getSentRequests)
router.get('/received', getReceivedRequests)
router.post('/accept/:senderId', acceptFriendRequest)
router.post('/:receiverId', createFriendRequest)
router.delete('/unsend/:receiverId', unsendFriendRequest)
router.delete('/decline/:senderId', declineFriendRequest)

export default router
