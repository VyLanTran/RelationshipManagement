import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { UniqueEnforcer } from 'enforce-unique'
import axios from 'axios'
import { Country, State, City } from 'country-state-city'
import { countryToAlpha2 } from 'country-to-iso'

import UserModel from '../models/UserModel.js'
import { generateRandomNum, generateRandomDate } from './utils.js'
import {
    countries,
    DEFAULT_PASSWORD,
    SALT_ROUNDS,
    FRIEND_RATIO,
    START_YEAR,
    END_YEAR,
} from './constants.js'
import FriendshipModel from '../models/FriendshipModel.js'

let universities = null
let cities = null

export const generateUsers = async (numRandomUsers = 50) => {
    return new Promise(async (resolve) => {
        // await generateDefaultUsers()
        await generateRandomUsers(numRandomUsers)
        await generateFriendRelationship()
        return resolve()
    })
}

export const generateRandomUsers = async (numUsers) => {
    if (numUsers <= 0) {
        return
    }

    return new Promise(async (resolve) => {
        console.log('========== Generating fake users... ==========')

        if (!universities) {
            universities = await fetchAllUniversities()
        }
        if (!cities) {
            cities = await fetchAllCities()
        }

        const data = []
        for (let i = 0; i < numUsers; i++) {
            const user = await generateUser(universities, cities)
            data.push(user)
        }
        await UserModel.insertMany(data)

        console.log(
            `========== COMPLETE - ${data.length}/${numUsers} users generated ==========`
        )

        return resolve()
    })
}

// generate one user for each team member
export const generateDefaultUsers = async () => {
    return new Promise(async (resolve) => {
        console.log(
            '========== Generating users Vy, Khang, Linh, Long... =========='
        )

        if (!universities) {
            universities = await fetchAllUniversities()
        }
        if (!cities) {
            cities = await fetchAllCities()
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS)
        const password = await bcrypt.hash(DEFAULT_PASSWORD, salt)

        const vy = UserModel({
            name: 'Vy Tran',
            email: 'tranlanvy1203@gmail.com',
            username: 'vytran1203',
            password: password,
            verified: true,
            company: 'Viet Tech',
            school: 'Bucknell University',
            phone: '(570) 241-8561',
            hometown: 'Ha Noi, Vietnam',
            currentCity: 'Lewisburg, PA',
            profilePicture: {
                url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
            },
            coverPhoto: null,
            friendIds: [],
            connectionIds: [],
            facebookId: null,
        })

        const khang = UserModel({
            name: 'Khang Nguyen',
            email: 'khang@gmail.com',
            username: 'khang_nguyen',
            password: password,
            verified: true,
            company: 'Viet Tech',
            school: 'York University',
            phone: '(123) 456-7890',
            hometown: 'Ho Chi Minh City, Vietnam',
            currentCity: 'Toronto, Canada',
            profilePicture: {
                url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
            },
            coverPhoto: null,
            friendIds: [],
            connectionIds: [],
            facebookId: null,
        })

        const linh = UserModel({
            name: 'Linh Tran',
            email: 'linh@gmail.com',
            username: 'linh_tran',
            password: password,
            verified: true,
            company: 'Viet Tech',
            school: 'Hobart and William Smith Colleges',
            phone: '(123) 456-7890',
            hometown: 'Ha Noi, Vietnam',
            currentCity: 'Geneva, NY, US',
            profilePicture: {
                url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
            },
            coverPhoto: null,
            friendIds: [],
            connectionIds: [],
            facebookId: null,
        })

        const long = UserModel({
            name: 'Long Dau',
            email: 'long@gmail.com',
            username: 'long_dau',
            password: password,
            verified: true,
            company: 'Viet Tech',
            school: 'Texas Christian University',
            phone: '(123) 456-7890',
            hometown: 'Ha Noi, Vietnam',
            currentCity: 'Fort Worth, Texas',
            profilePicture: {
                url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
            },
            coverPhoto: null,
            friendIds: [],
            connectionIds: [],
            facebookId: null,
        })

        await vy.save()
        await khang.save()
        await linh.save()
        await long.save()

        console.log(
            '========== COMPLETE - 4 default users generated =========='
        )

        return resolve()
    })
}

const generateUser = async (universities, cities) => {
    const uniqueEnforcer = new UniqueEnforcer()

    const sex = faker.person.sexType()
    const firstName = faker.person.firstName(sex)
    const lastName = faker.person.lastName()

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const password = await bcrypt.hash(DEFAULT_PASSWORD, salt)

    const user = {
        name: [firstName, lastName].join(' '),
        email: uniqueEnforcer.enforce(
            faker.internet.email({
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase(),
            })
        ),
        username: faker.internet.userName({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
        }),
        password: password,
        verified: true,
        company: faker.company.name(),
        school: universities[generateRandomNum(0, universities.length - 1)],
        phone: faker.helpers.fromRegExp('([0-9]{3}) [0-9]{3}-[0-9]{4}'),

        hometown: cities[generateRandomNum(0, cities.length - 1)],
        currentCity: cities[generateRandomNum(0, cities.length - 1)],

        profilePicture: {
            url: faker.image.avatar(),
        },
        coverPhoto: {
            url: faker.image.urlPicsumPhotos(),
        },

        friendIds: [],
        connectionIds: [],
        facebookId: null,
    }

    return user
}

const generateFriendRelationship = async () => {
    console.log('========== Generating relationship between users ==========')

    const allUsers = await UserModel.find({}, '_id')
    const userIds = allUsers.map((user) => user._id.toString())
    const totalUsers = userIds.length

    if (totalUsers <= 1) return

    const friendships = {} // a dict with key = user ID, value = set of friend IDs
    userIds.forEach((userId) => {
        friendships[userId] = new Set()
    })

    userIds.forEach((userId, index) => {
        // Randomly choose number of friends for this user
        const numFriends = generateRandomNum(
            2,
            Math.floor(totalUsers * FRIEND_RATIO)
        )

        while (friendships[userId].size < numFriends) {
            const friendId = userIds[generateRandomNum(0, totalUsers - 1)]

            if (friendId !== userId && !friendships[userId].has(friendId)) {
                friendships[userId].add(friendId)
                friendships[friendId].add(userId)
            }
        }
    })

    // Update users with friendIds
    const bulkOps = userIds.map((userId) => {
        return {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(userId) },
                update: { friendIds: Array.from(friendships[userId]) },
            },
        }
    })

    // Update friendship table accordingly
    const bulkFriendshipOps = []
    const processedFriendships = new Set()

    userIds.forEach((userId) => {
        friendships[userId].forEach((friendId) => {
            const friendshipKey = [userId, friendId].sort().join('-')
            if (!processedFriendships.has(friendshipKey)) {
                processedFriendships.add(friendshipKey)

                const establishedAt = generateRandomDate(START_YEAR, END_YEAR)

                bulkFriendshipOps.push({
                    updateOne: {
                        filter: {
                            user1: new mongoose.Types.ObjectId(userId),
                            user2: new mongoose.Types.ObjectId(friendId),
                        },
                        update: {
                            user1: userId,
                            user2: friendId,
                            establishedAt,
                        },
                        upsert: true,
                    },
                })
            }
        })
    })

    await UserModel.bulkWrite(bulkOps)
    await FriendshipModel.bulkWrite(bulkFriendshipOps)

    console.log('========== COMPLETE - relationship generated ==========')
}

const fetchAllUniversities = async () => {
    const sparqlQuery = `
    SELECT ?university ?universityLabel
    WHERE {
        ?university rdf:type <http://dbpedia.org/ontology/University> .
        ?university rdfs:label ?universityLabel .
        ?university <http://dbpedia.org/ontology/country> ?country .
        FILTER (lang(?universityLabel) = 'en')
        VALUES ?country {
            <http://dbpedia.org/resource/United_States>
            <http://dbpedia.org/resource/United_Kingdom>
            <http://dbpedia.org/resource/Australia>
            <http://dbpedia.org/resource/Canada>
            <http://dbpedia.org/resource/France>
            <http://dbpedia.org/resource/Germany>
            <http://dbpedia.org/resource/Japan>
            <http://dbpedia.org/resource/China>
        }
    }
    `

    const endpointUrl = 'https://dbpedia.org/sparql'

    try {
        const response = await axios.get(endpointUrl, {
            params: {
                query: sparqlQuery,
                format: 'json',
            },
            headers: {
                Accept: 'application/sparql-results+json',
            },
        })

        const universities = response.data.results.bindings.map(
            (binding) => binding.universityLabel.value
        )
        return universities
    } catch (error) {
        console.error('Error fetching university data:', error)
        return []
    }
}

const fetchAllCities = async () => {
    const cities = []

    for (let countryName of countries) {
        const countryCode = countryToAlpha2(countryName)
        const cityList = City.getCitiesOfCountry(countryCode)
        for (let city of cityList) {
            const cityName = city['name']
            const stateCode = city['stateCode']

            let address = ''
            address = isNaN(stateCode)
                ? [cityName, stateCode, countryName].join(', ')
                : [cityName, countryName].join(', ')
            cities.push(address)
        }
    }

    return cities
}
