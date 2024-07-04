import express from 'express'
import {
    getYearRange,
    getFriendshipTimeline,
    getAnniversary,
} from '../controllers/friendshipController.js'

import { verifyAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(verifyAuth)

router.get('/getYearRange', getYearRange)
router.get('/timeline', getFriendshipTimeline)
router.get('/anniversary/:otherUserId', getAnniversary)

export default router
