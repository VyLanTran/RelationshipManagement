import express from 'express'
import {
    signup,
    login,
    // loginWithFacebook,
    authWithGoogle,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/google/', authWithGoogle)
// router.post('/facebook', loginWithFacebook)

export default router
