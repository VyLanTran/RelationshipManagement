import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js'
import validator from 'validator'

export const signup = async (req, res) => {
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

        const token = createToken(user._id)

        res.status(201).json({ user, token })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const login = async (req, res) => {
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

        const token = createToken(user._id)

        res.status(201).json({ user, token })
    } catch (err) {
        res.status(500).json({ error: err.message })
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

export const loginWithFacebook = async (req, res) => {
    try {
        const { facebookId, name, email, username, password } = req.body
        const existedUser = await UserModel.findOne({ facebookId: facebookId })

        // If user already existed, only login
        if (existedUser) {
            const token = createToken(existedUser._id)
            res.status(201).json({ user: existedUser, token })
        } else {
            // Create a random password and allow them to change later
            // TODO: reset/forget password
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = await UserModel.create({
                name,
                email,
                username,
                password: hashedPassword,
                facebookId: facebookId,
            })
            const token = createToken(user._id)
            res.status(201).json({ user, token })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}
