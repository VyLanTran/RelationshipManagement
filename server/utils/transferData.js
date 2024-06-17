import neo4j from 'neo4j-driver'
import dotenv from 'dotenv'
import { connectDB } from '../index.js'
import UserModel from '../models/UserModel.js'

dotenv.config()

const neo4jUrl = process.env.NEO4J_URI
const neo4jUser = process.env.NEO4J_USERNAME
const neo4jPassword = process.env.NEO4J_PASSWORD

const run = async () => {
    try {
        console.log('Running data transfer...')
        await configureDB()
        console.log('Transferring data...')
        await transferData()
        console.log('Finished transfering data from MongoDB to neo4j!')
        process.exit()
    } catch (err) {
        process.exit(1)
    }
}

const configureDB = () => {
    return new Promise(async (resolve) => {
        connectDB()
        await sleep(2)
        return resolve()
    })
}

const sleep = (s) => {
    return new Promise((resolve) => {
        setTimeout(resolve, s * 1000)
    })
}

async function transferData() {
    const driver = neo4j.driver(
        neo4jUrl,
        neo4j.auth.basic(neo4jUser, neo4jPassword)
    )
    const session = driver.session()

    try {
        const users = await UserModel.find().lean()

        for (const user of users) {
            const {
                _id,
                name,
                email,
                username,
                company,
                school,
                phone,
                hometown,
                currentCity,
                profilePicture,
                friendIds,
                posts,
            } = user

            const profilePictureUrl = profilePicture.url
                ? profilePicture.url
                : 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg'

            // Create user node
            await session.run(
                `CREATE (u:User {id: $id, name: $name, email: $email, username: $username, company: $company, school: $school, phone: $phone, hometown: $hometown, currentCity: $currentCity, profilePictureUrl: $profilePictureUrl})`,
                {
                    id: _id.toString(),
                    name,
                    email,
                    username,
                    company,
                    school,
                    phone,
                    hometown,
                    currentCity,
                    profilePictureUrl,
                }
            )

            // Create friend relationships
            for (const friendId of friendIds) {
                await session.run(
                    `MATCH (u1:User {id: $id1}), (u2:User {id: $id2})
                    MERGE (u1)-[:FRIEND]->(u2)
                    MERGE (u2)-[:FRIEND]->(u1)`,
                    { id1: _id.toString(), id2: friendId.toString() }
                )
            }
        }

        console.log('Data transfer complete')
    } catch (error) {
        console.error('Error transferring data:', error)
    } finally {
        await session.close()
        await driver.close()
    }
}

run()
