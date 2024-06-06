import express from 'express'
import {
    signup,
    login,
    // loginWithFacebook,
    authWithGoogle,
    verifyAccount,
    resendEmail,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/google/', authWithGoogle)
// router.post('/facebook', loginWithFacebook)
router.get('/:id/verify/:token', verifyAccount)
router.post('/:id/resendEmail', resendEmail)

export default router
