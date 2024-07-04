import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { UniqueEnforcer } from 'enforce-unique'
import axios from 'axios'
import { Country, State, City } from 'country-state-city'
import { countryToAlpha2 } from 'country-to-iso'
import { promises as fs } from 'fs'
import path from 'path'

import { mentorshipTeam } from './viet_tech_data.js'
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
let hobbies = null
let vietTechData = null

export const generateUsers = async (numRandomUsers = 50) => {
    return new Promise(async (resolve) => {
        await generateDefaultUsers()
        vietTechData = await fetchVietTechData()
        await generateVietTechUsers()
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
        if (!hobbies) {
            hobbies = await fetchAllHobbies()
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
        if (!hobbies) {
            hobbies = await fetchAllHobbies()
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS)
        const password = await bcrypt.hash(DEFAULT_PASSWORD, salt)

        // const vy = UserModel({
        //     name: 'Vy Tran',
        //     email: 'tranlanvy1203@gmail.com',
        //     username: 'vytran1203',
        //     password: password,
        //     verified: true,
        //     company: 'Viet Tech',
        //     school: 'Bucknell University',
        //     phone: '(570) 241-8561',
        //     hometown: 'Ha Noi, Vietnam',
        //     currentCity: 'Lewisburg, PA',
        //     profilePicture: {
        //         url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
        //     },
        //     coverPhoto: null,
        //     friendIds: [],
        //     connectionIds: [],
        //     facebookId: null,
        //     birthday: faker.date.birthdate({
        //         min: 1990,
        //         max: 2005,
        //         mode: 'year',
        //     }),
        //     hobbies: ['soccer', 'mountains', 'dogs'],
        // })

        // const khang = UserModel({
        //     name: 'Khang Nguyen',
        //     email: 'khang@gmail.com',
        //     username: 'jimmynguyen',
        //     password: password,
        //     verified: true,
        //     company: 'Viet Tech',
        //     school: 'York University',
        //     phone: '(123) 456-7890',
        //     hometown: 'Ho Chi Minh City, Vietnam',
        //     currentCity: 'Toronto, Canada',
        //     profilePicture: {
        //         url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
        //     },

        //     coverPhoto: null,
        //     friendIds: [],
        //     connectionIds: [],
        //     facebookId: null,
        //     birthday: faker.date.birthdate({
        //         min: 1990,
        //         max: 2005,
        //         mode: 'year',
        //     }),
        //     hobbies: ['ice-skating', 'MUN', 'skywatching'],
        // })

        // const linh = UserModel({
        //     name: 'Linh Tran',
        //     email: 'linh@gmail.com',
        //     username: 'linhtran',
        //     password: password,
        //     verified: true,
        //     company: 'Viet Tech',
        //     school: 'Hobart and William Smith Colleges',
        //     phone: '(123) 456-7890',
        //     hometown: 'Ha Noi, Vietnam',
        //     currentCity: 'Geneva, NY, US',
        //     profilePicture: {
        //         url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
        //     },
        //     coverPhoto: null,
        //     friendIds: [],
        //     connectionIds: [],
        //     facebookId: null,
        //     birthday: faker.date.birthdate({
        //         min: 1990,
        //         max: 2005,
        //         mode: 'year',
        //     }),
        //     hobbies: ['draw', 'sleep', 'axolotl'],
        // })

        // const long = UserModel({
        //     name: 'Long Dau',
        //     email: 'long@gmail.com',
        //     username: 'longdau',
        //     password: password,
        //     verified: true,
        //     company: 'Viet Tech',
        //     school: 'Texas Christian University',
        //     phone: '(123) 456-7890',
        //     hometown: 'Ha Noi, Vietnam',
        //     currentCity: 'Fort Worth, Texas',
        //     profilePicture: {
        //         url: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg',
        //     },
        //     coverPhoto: null,
        //     friendIds: [],
        //     connectionIds: [],
        //     facebookId: null,
        //     birthday: faker.date.birthdate({
        //         min: 1990,
        //         max: 2005,
        //         mode: 'year',
        //     }),
        //     hobbies: ['sports', 'video game', 'rap'],
        // })

        // await vy.save()
        // await khang.save()
        // await linh.save()
        // await long.save()

        const users = [
            {
                name: 'Vy Tran',
                email: 'tranlanvy1203@gmail.com',
                username: 'vytran1203',
                school: 'Bucknell University',
                hometown: 'Ha Noi, Vietnam',
                currentCity: 'Lewisburg, PA',
                profilePicture: {
                    url: 'https://res.cloudinary.com/khoa165/image/upload/v1711832950/viettech/vytran.jpg',
                },
                birthday: faker.date.birthdate({
                    min: 1990,
                    max: 2005,
                    mode: 'year',
                }),
                hobbies: ['soccer', 'mountains', 'dogs'],
            },
            {
                name: 'Khang Nguyen',
                email: 'jimmykhangnguyen@gmail.com',
                username: 'jimmynguyen',
                school: 'York University',
                hometown: 'Ho Chi Minh City, Vietnam',
                currentCity: 'Toronto, Canada',
                profilePicture: {
                    url: 'https://res.cloudinary.com/khoa165/image/upload/v1711290737/viettech/phuckhang.jpg',
                },
                birthday: faker.date.birthdate({
                    min: 1990,
                    max: 2005,
                    mode: 'year',
                }),
                hobbies: ['ice-skating', 'MUN', 'skywatching'],
            },
            {
                name: 'Linh Tran',
                email: 'linh@gmail.com',
                username: 'linhtran',
                school: 'Hobart and William Smith Colleges',
                hometown: 'Ha Noi, Vietnam',
                currentCity: 'Geneva, NY, US',
                profilePicture: {
                    url: 'https://res.cloudinary.com/khoa165/image/upload/v1711839128/viettech/tranglinh.jpg',
                },
                birthday: faker.date.birthdate({
                    min: 1990,
                    max: 2005,
                    mode: 'year',
                }),
                hobbies: ['draw', 'sleep', 'axolotl'],
            },
            {
                name: 'Long Dau',
                email: 'long@gmail.com',
                username: 'longdau',
                school: 'Texas Christian University',
                hometown: 'Ha Noi, Vietnam',
                currentCity: 'Fort Worth, Texas',
                profilePicture: {
                    url: 'https://res.cloudinary.com/khoa165/image/upload/v1711170436/viettech/long.jpg',
                },
                birthday: faker.date.birthdate({
                    min: 1990,
                    max: 2005,
                    mode: 'year',
                }),
                hobbies: ['sports', 'video game', 'rap'],
            },
        ]

        const userModels = await Promise.all(
            users.map(async (user) => {
                return new UserModel({
                    ...user,
                    password: password,
                    verified: true,
                    company: 'Viet Tech',
                    phone: faker.helpers.fromRegExp(
                        '([0-9]{3}) [0-9]{3}-[0-9]{4}'
                    ),
                    coverPhoto: {
                        url: faker.image.urlPicsumPhotos(),
                    },
                    friendIds: [],
                    connectionIds: [],
                    facebookId: null,
                })
            })
        )

        const insertedUsers = await UserModel.insertMany(userModels)

        console.log(
            '========== COMPLETE - 4 default users generated =========='
        )

        // return resolve()
        return resolve(insertedUsers)
    })
}

export const generateVietTechUsers = async () => {
    if (!vietTechData) {
        vietTechData = await fetchVietTechData()
    }

    return new Promise(async (resolve) => {
        console.log('========== Generating Viet Tech users... ==========')

        const insertedVietTechUsers = await UserModel.insertMany(vietTechData)

        console.log(
            `========== COMPLETE - Viet Tech users generated ==========`
        )

        return resolve(insertedVietTechUsers)
    })
}

const fetchVietTechData = async () => {
    const uniqueEnforcer = new UniqueEnforcer()

    if (!universities) {
        universities = await fetchAllUniversities()
    }
    if (!cities) {
        cities = await fetchAllCities()
    }

    const vietTechUsers = Object.values(mentorshipTeam)

    const users = []

    for (const vietTechUser of vietTechUsers) {
        const nameComponents = vietTechUser.name.trim().split(/\s+/)
        const firstName = nameComponents[0]
        const lastName = nameComponents[1]

        const salt = await bcrypt.genSalt(SALT_ROUNDS)
        const password = await bcrypt.hash(DEFAULT_PASSWORD, salt)

        const hobbies = vietTechUser.hobbies.split(', ')

        const user = {
            name: vietTechUser.name,
            email: uniqueEnforcer.enforce(
                faker.internet.email({
                    firstName: firstName.toLowerCase(),
                    lastName: lastName.toLowerCase(),
                })
            ),
            username: faker.internet.userName({
                fistName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase(),
            }),
            password: password,
            verified: true,
            company: 'Viet Tech',
            school: universities[generateRandomNum(0, universities.length - 1)],
            phone: faker.helpers.fromRegExp('([0-9]{3}) [0-9]{3}-[0-9]{4}'),
            hometown: 'Vietnam',
            currentCity: cities[generateRandomNum(0, cities.length - 1)],
            profilePicture: {
                url: vietTechUser.avatar,
            },
            coverPhoto: {
                url: faker.image.urlPicsumPhotos(),
            },
            birthday: faker.date.birthdate({
                min: 1990,
                max: 2005,
                mode: 'year',
            }),
            hobbies: hobbies,
            friendIds: [],
            connectionIds: [],
            facebookId: null,
        }

        users.push(user)
    }

    return users
}

const generateUser = async (universities, cities) => {
    const uniqueEnforcer = new UniqueEnforcer()

    const sex = faker.person.sexType()
    const firstName = faker.person.firstName(sex)
    const lastName = faker.person.lastName()

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const password = await bcrypt.hash(DEFAULT_PASSWORD, salt)

    // Select 3 unique random hobby indices
    const hobbyIndices = []
    while (hobbyIndices.length < 3) {
        const randomIndex = generateRandomNum(0, hobbies.length - 1)
        if (!hobbyIndices.includes(randomIndex)) {
            hobbyIndices.push(randomIndex)
        }
    }

    // Add selected hobbies to hobbyArray
    const hobbyArray = hobbyIndices.map((index) => hobbies[index])

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
        birthday: faker.date.birthdate({ min: 1990, max: 2005, mode: 'year' }),
        hobbies: hobbyArray,
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

    // Add predefined relationships for default users and Viet Tech users
    const predefinedUsers = await UserModel.find(
        {
            username: {
                $in: ['vytran1203', 'jimmynguyen', 'linhtran', 'longdau'],
            },
        },
        '_id'
    )
    const predefinedUserIds = predefinedUsers.map((user) => user._id.toString())

    // Fetch Viet Tech users
    const vietTechUsers = await UserModel.find(
        {
            company: 'Viet Tech',
            username: {
                $nin: ['vytran1203', 'jimmynguyen', 'linhtran', 'longdau'],
            },
        },
        '_id'
    )
    const vietTechUserIds = vietTechUsers.map((user) => user._id.toString())

    predefinedUserIds.forEach((userId) => {
        predefinedUserIds.forEach((friendId) => {
            if (userId !== friendId) {
                friendships[userId].add(friendId)
                friendships[friendId].add(userId)
            }
        })
        vietTechUserIds.forEach((vietTechUserId) => {
            friendships[userId].add(vietTechUserId)
            friendships[vietTechUserId].add(userId)
        })
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

    // Update Friendship table accordingly
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

const fetchAllHobbies = async () => {
    let hobbiesData
    try {
        const __filename = new URL(import.meta.url).pathname
        const __dirname = path.dirname(__filename)
        const hobbiesFilePath = path.join(__dirname, 'hobbies.json')
        const hobbiesJson = await fs.readFile(hobbiesFilePath, 'utf8')
        hobbiesData = JSON.parse(hobbiesJson)
    } catch (error) {
        console.error('Error reading hobbies file:', error)
        return [] // Return empty array on error
    }

    // Extract hobby strings from hobbiesData
    const hobbyStrings = hobbiesData.map((hobbyObj) => hobbyObj.hobby)

    return hobbyStrings
}
