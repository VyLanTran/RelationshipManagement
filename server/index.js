import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import connectionRoutes from './routes/connectionRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import diaryRoutes from './routes/diaryRoutes.js'

dotenv.config()
const app = express()
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

const PORT = process.env.PORT || 8080
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Successfully connect to port ${PORT}`))
  })
  .catch((err) => console.log(`${err}`))
