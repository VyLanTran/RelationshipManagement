import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js'
import validator from 'validator'
import TokenModel from '../models/TokenModel.js'
import sendEmail from '../utils/sendEmail.js'
import crypto from 'crypto'

export const signup = async (req, res) => {
    const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL

    // TODO: separate error from the system vs error from user (only use toast to display error from user's input)
    try {
        const { name, email, username, password, confirmPassword } = req.body

        // Check if all inputs are valid before actually create a new user
        if (!name || !email || !username || !password) {
            throw Error('All fields must be filled')
        }
        if (!validator.isEmail(email)) {
            throw Error('Email is not valid')
        }
        const exists = await UserModel.findOne({ email })
        if (exists) {
            throw Error('This email already existed')
        }
        if (password != confirmPassword) {
            throw Error("Confirm password doesn't match")
        }
        // TODO: make this less strict
        // if (!validator.isStrongPassword(password)) {
        //   throw Error(
        //     "Password must be at least 12 characters and contain uppercase letters, lowercase letters, numbers, and symbols"
        //   );
        // }

        // Create a new user
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await UserModel.create({
            name,
            email,
            username,
            password: hashedPassword,
        })

        // const token = createToken(user._id)
        const token = await TokenModel.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        })

        const url = `${CLIENT_BASE_URL}/auth/${user._id}/verify/${token.token}`
        await sendEmail(user.email, 'APP_NAME Account Activation', url)

        res.status(201).json({
            user,
            message:
                'Thank you for registering. You will receive an email containing a link to confirm this registration. Please follow the instructions in the email in order to activate your APP_NAME account.',
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const verifyAccount = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.params.id })
        if (!user) {
            return res.status(404).json({ error: 'Invalid link' })
        }

        const token = await TokenModel.findOne({
            userId: user._id,
            token: req.params.token,
        })
        if (!token) {
            return res.status(404).json({ error: 'Invalid link' })
        }

        // update verified to true
        await UserModel.updateOne(
            { _id: user._id },
            { $set: { verified: true } }
        )
        // delete the token
        await TokenModel.deleteOne({ _id: token._id })

        res.status(201).json({ message: 'Account verified successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const login = async (req, res) => {
    const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL

    try {
        const { email, password } = req.body

        // Check if all inputs are valid before actually create a new user
        if (!email || !password) {
            throw Error('All fields must be filled')
        }
        if (!validator.isEmail(email)) {
            throw Error('Email is not valid')
        }
        // Check if an user with that email exists in our database
        const user = await UserModel.findOne({ email: email }).lean() // findOne() is a form of MongoDB query, returning instance of User schema

        // If no such email is found in the database
        if (!user) {
            throw Error("This email doesn't match an account")
        }

        // Check if password is matched
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw Error('Password is incorrect')
        }

        if (!user.verified) {
            let token = await TokenModel.findOne({ userId: user._id })
            if (!token) {
                // Create a new token and send email
                token = await TokenModel.create({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex'),
                })

                const url = `${CLIENT_BASE_URL}/auth/${user._id}/verify/${token.token}`
                await sendEmail(user.email, 'APP_NAME Account Activation', url)
            }
            // if a token exists (i.e. created and not expired yet), tell user to check their email
            return res.status(400).json({
                error: 'The verification link was already sent to your email, please verify',
            })
        }

        const token = createToken(user._id)

        res.status(201).json({ user, token })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// create a new token and resend email
export const resendEmail = async (req, res) => {
    // TODO: delete current token of the same user (if exist before creating a new one)
    const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL

    try {
        const user = await UserModel.findOne({ _id: req.params.id })
        if (!user) {
            return res.status(404).json({ error: 'Invalid user' })
        }
        const token = await TokenModel.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        })

        const url = `${CLIENT_BASE_URL}/auth/${user._id}/verify/${token.token}`
        await sendEmail(user.email, 'APP_NAME Account Activation', url)
        res.status(201).json({ message: 'A new email is sent' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const authWithGoogle = async (req, res) => {
    try {
        const { name, email, username, password, profilePicture } = req.body

        const existedUser = await UserModel.findOne({ email })
        if (existedUser) {
            const token = createToken(existedUser._id)
            res.status(201).json({ user: existedUser, token })
        } else {
            // Create a new user
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = await UserModel.create({
                name,
                email,
                username,
                password: hashedPassword,
                // profilePicture,
            })
            const token = createToken(user._id)
            res.status(201).json({ user, token })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// export const loginWithFacebook = async (req, res) => {
//     try {
//         const { facebookId, name, email, username, password } = req.body
//         const existedUser = await UserModel.findOne({ facebookId: facebookId })

//         // If user already existed, only login
//         if (existedUser) {
//             const token = createToken(existedUser._id)
//             res.status(201).json({ user: existedUser, token })
//         } else {
//             // Create a random password and allow them to change later
//             // TODO: reset/forget password
//             const salt = await bcrypt.genSalt()
//             const hashedPassword = await bcrypt.hash(password, salt)

//             const user = await UserModel.create({
//                 name,
//                 email,
//                 username,
//                 password: hashedPassword,
//                 facebookId: facebookId,
//             })
//             const token = createToken(user._id)
//             res.status(201).json({ user, token })
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message })
//     }
// }

export const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}
