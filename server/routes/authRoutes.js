import express from 'express'
import {
    signup,
    login,
    loginWithFacebook,
} from '../controllers/authControllers.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/facebook', loginWithFacebook)

export default router
