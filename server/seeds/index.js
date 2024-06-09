import mongoose from 'mongoose'

import {
    generateDefaultUsers,
    generateRandomUsers,
    generateUsers,
} from './User.js'
import { connectDB } from '../index.js'
import UserModel from '../models/UserModel.js'

const run = async () => {
    try {
        console.log('Running seeds...')
        await configureDB()
        console.log('Generating mock data...')
        await generate()
        console.log('Finished running seeds!')
        process.exit()
    } catch (err) {
        process.exit(1)
    }
}

const generate = () => {
    return new Promise(async (resolve) => {
        const numRandomUsers = 30
        // await generateDefaultUsers()
        // await generateUsers(numUsers)

        await generateUsers(numRandomUsers)

        // await deleteAllExceptSpecifiedUsers()

        return resolve()
    })
}

const configureDB = () => {
    return new Promise(async (resolve) => {
        connectDB()
        await sleep(2)
        // mongoose.connection.db.dropDatabase(() => {
        //     console.log('Dropping database...')
        // })
        await sleep(2)
        return resolve()
    })
}

const sleep = (s) => {
    return new Promise((resolve) => {
        setTimeout(resolve, s * 1000)
    })
}

// const deleteAllExceptSpecifiedUsers = async () => {
//     try {
//         const idsToKeep = [
//             new mongoose.Types.ObjectId('66281a90985b1127397389bb'),
//             new mongoose.Types.ObjectId('665d3474a426fb4f27b094ce'),
//             new mongoose.Types.ObjectId('665d50291cd87015148ff20e'),
//         ]

//         const result = await UserModel.deleteMany({
//             _id: { $nin: idsToKeep },
//         })

//         console.log(`Deleted ${result.deletedCount} users`)
//     } catch (err) {
//         console.error('Error deleting users:', err)
//     }
// }

run()
