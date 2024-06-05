import mongoose from 'mongoose'

import {
    generateDefaultUsers,
    generateRandomUsers,
    generateUsers,
} from './User.js'
import { connectDB } from '../index.js'

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
        // const numUsers = 2
        // await generateDefaultUsers()
        // await generateUsers(numUsers)

        // await generateUsers(10)

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

run()
