import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { Server } from 'socket.io'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import connectionRoutes from './routes/connectionRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import diaryRoutes from './routes/diaryRoutes.js'
import postRoutes from './routes/postRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import cookieSession from 'cookie-session'
import passport from 'passport'

dotenv.config()
const app = express()

// cookie-session simplifies session management by storing session data directly in encrypted cookie
app.use(
    cookieSession({
        name: 'session',
        keys: ['group4'], //  An array of secret keys used for encrypting and decrypting the session data stored in the cookie
        maxAge: 24 * 60 * 60 * 100, // 1 day = 24 hours * 60 mins * 60 sec * 100 milisec
    })
)
app.use(passport.initialize())
app.use(passport.session())

// app.use(express.json());
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/groups', groupRoutes)
app.use('/connections', connectionRoutes)
app.use('/chats', chatRoutes)
app.use('/messages', messageRoutes)
app.use('/diary', diaryRoutes)
app.use('/posts', postRoutes)
app.use('/events', eventRoutes)

const PORT = process.env.PORT || 8080

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1) // Exit with a non-zero status code to indicate an error
    }
}

// mongoose.connect(process.env.MONGO_URL)
// .then(() => {
//   app.listen(PORT, () => console.log(`Successfully connect to port ${PORT}`))
// })
// .catch((err) => console.log(`${err}`))

connectDB()

const server = app.listen(
    PORT,
    console.log(`Successfully connect to port ${PORT}`)
)

const io = new Server(server, {
    pingTimeout: 60000, // waiting time before close off
    cors: {
        origin: 'http://localhost:3000',
    },
})

io.on('connection', (socket) => {
    console.log('Successfully connect to socket.io')

    // Create a room for this user (ourself) with user information from the frontend
    // the name of this socket is 'setup'
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        // console.log(userData._id)
        socket.emit('connected')
    })

    // Create a chat room
    // The id of each room will be the id of the Chat object
    socket.on('join chat', (room) => {
        socket.join(room)
        console.log(`Successfully joined room ${room}`)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (messageReceived) => {
        // Get the chat to which this messag belongs
        var chat = messageReceived.chat

        if (!chat) return console.log('Chat undefined')
        if (!chat.members) return console.log('chat.members not defined')

        // console.log(chat.members)
        chat.members.forEach((member) => {
            // If the message is sent by us, we should not received (a notification) about it
            if (member._id == messageReceived.sender._id) return

            // every other users in the room will emit the information 'I received this message'
            socket.in(member._id).emit('message received', messageReceived)
        })
    })

    socket.off('setup', () => {
        console.log('USER DISCONNECTED')
        socket.leave(userData._id)
    })
})
