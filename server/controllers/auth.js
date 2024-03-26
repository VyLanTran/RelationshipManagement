import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            username,
            password
        } = req.body
        
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword
        })

        const savedUser = await newUser.save()      // save() is a form of MongoDB query
        res.status(201).json(savedUser)
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        // Check if an user with that email exists
        const user = await User.findOne({email: email})     // findOne() is a form of MongoDB query, returning instance of User schema
        
        // If no such email is found in the database
        if (!user)
            return res.status(400).json({msg: 'Email does not exist'});

        // Check if password is matched
        const isMatch = bcrypt.compare(password, user.password);

        if (!isMatch) 
            return res.status(400).json({msg: "Password does not match"})

        // TODO: learn about token
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET
            );

        res.status(201).json({msg: 'Successfully log in', token, user})


    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
}