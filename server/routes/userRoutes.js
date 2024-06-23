import express from 'express'

import {
    getAllUsers,
    getUser,
    updateProfile,
    createProfilePicture,
    createCoverPhoto,
    getAllFriends,
    searchUsers,
    getAllNonFriends,
    getFriendGeography,
    getFriendRecommendations,
} from '../controllers/userController.js'

import { verifyAuth } from '../middleware/auth.js'

const router = express.Router()

// middleware to ensure that user must be authenticated before they can use any of these routes
router.use(verifyAuth)

router.get('/search', searchUsers)
router.get('/nonFriends', getAllNonFriends)
router.get('/recommend', getFriendRecommendations)
router.get('/friendGeography', getFriendGeography)
router.get('/:userId', getUser)
router.get('/:userId/friends', getAllFriends)
router.get('/', getAllUsers)
router.patch('/', updateProfile)
router.patch('/profilePicture', createProfilePicture)
router.patch('/coverPhoto', createCoverPhoto)

export default router
