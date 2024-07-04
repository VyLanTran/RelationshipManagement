import axios from 'axios'
import UserModel from '../models/UserModel.js'
import cloudinary from '../utils/cloudinary.js'
import { countryToAlpha3 } from 'country-to-iso'

// GET
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.status(200).json(users)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await UserModel.findById(userId)
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

// Get friend list of a certain user
export const getAllFriends = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await UserModel.findById(userId)
        const friends = await Promise.all(
            user.friendIds.map((friendId) =>
                UserModel.findById(friendId).select(
                    'name email phone company school currentCity hometown hobbies profilePicture posts'
                )
            )
        )
        res.status(200).json(friends)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

// Get all non-friends of us
export const getAllNonFriends = async (req, res) => {
    try {
        const myself = req.user
        if (!myself) {
            return res.status(404).json({ error: 'Authentication required' })
        }

        const nonFriends = await UserModel.find({
            _id: { $nin: [...myself.friendIds, myself._id] }, // don't include myself
        }).select('-password')

        res.status(200).json(nonFriends)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

export const getFriendRecommendations = async (req, res) => {
    try {
        const currentUser = req.user
        if (!currentUser) {
            return res.status(404).json({ error: 'Authentication required' })
        }

        const nonFriends = await UserModel.find({
            _id: { $nin: [...currentUser.friendIds, currentUser._id] },
        }).select('-password')

        // Send request to Flask API
        const response = await axios.post('http://127.0.0.1:5000/recommend', {
            currentUser: currentUser.toObject(),
            nonFriends: nonFriends.map((user) => user.toObject()),
        })

        const recommendations = []
        for (let item of response.data) {
            recommendations.push(item[0])
        }
        res.status(200).json(recommendations)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Search users with keyword
// route: /users/search/?search={keyword}
export const searchUsers = async (req, res) => {
    try {
        const keyword = req.query.search
        const words = keyword.toLowerCase().split(/\s+/)

        const user = await UserModel.findById(req.user._id)
        const friends = await Promise.all(
            user.friendIds.map((friendId) =>
                UserModel.findById(friendId).select(
                    'name email username profilePicture'
                )
            )
        )
        const filteredUsers = friends.filter((friend) => isMatch(friend, words))

        res.status(201).json(filteredUsers)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

const isMatch = (user, words) => {
    return words.some(
        (word) =>
            user.name.toLowerCase().includes(word) ||
            user.email.toLowerCase().includes(word) ||
            user.username.toLowerCase().includes(word)
    )
}

// PATCH
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
                ...req.body,
            },
            {
                new: true,
                runValidators: true,
            }
        )

        return res.status(200).json(updatedUser)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const createProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id
        const { profilePicture } = req.body
        const uploadRes = await cloudinary.uploader.upload(profilePicture, {
            upload_preset: 'group4-preset',
        })
        if (uploadRes) {
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { profilePicture: uploadRes } },
                {
                    new: true,
                    runValidators: true,
                }
            )
            res.status(200).json(updatedUser)
        }
    } catch (err) {
        res.status(404).json({ mesage: err.message })
    }
}

export const createCoverPhoto = async (req, res) => {
    try {
        const userId = req.user._id
        const { coverPhoto } = req.body
        const uploadRes = await cloudinary.uploader.upload(coverPhoto, {
            upload_preset: 'group4-preset',
        })
        if (uploadRes) {
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { coverPhoto: uploadRes } },
                {
                    new: true,
                    runValidators: true,
                }
            )
            res.status(200).json(updatedUser)
        }
    } catch (err) {
        res.status(404).json({ mesage: err.message })
    }
}

export const getFriendGeography = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id)
        const friends = await Promise.all(
            user.friendIds.map((friendId) =>
                UserModel.findById(friendId).select('name currentCity')
            )
        )

        const mappedLocations = friends.reduce((acc, { currentCity }) => {
            const parts = currentCity.split(',')
            const country = parts[parts.length - 1].trim()

            let countryISO3 = countryToAlpha3(country)
            if (countryISO3 == null) {
                countryISO3 = 'Other'
            }
            if (!acc[countryISO3]) {
                acc[countryISO3] = 0
            }
            acc[countryISO3]++
            return acc
        }, {})

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return { id: country, value: count }
            }
        )

        res.status(200).json(formattedLocations)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

const api_key = process.env.UNSPLASH_API_KEY

export const getIntroImages = async (req, res) => {
    try {
        let { currentCity, hometown, school, hobbies } = req.body

        // Ensure hobbies is an array even if it's not provided
        hobbies = hobbies || []

        // Function to fetch image from Unsplash API
        const fetchImage = async (query) => {
            const response = await axios.get(
                `https://api.unsplash.com/search/photos?query=${query}&client_id=${api_key}`
            )
            return response.data.results[0]?.urls?.small
        }

        // Creating an array of promises for each API call
        const requests = []
        if (currentCity) requests.push(fetchImage(currentCity))
        if (hometown) requests.push(fetchImage(hometown))
        if (school) requests.push(fetchImage(school))
        hobbies.forEach((hobby) => {
            if (hobby) requests.push(fetchImage(hobby))
        })

        // Waiting for all promises to resolve
        const results = await Promise.all(requests)

        let responseData = {}
        let index = 0

        if (currentCity) {
            responseData.currentCityImage = results[index++]
        }
        if (hometown) {
            responseData.hometownImage = results[index++]
        }
        if (school) {
            responseData.schoolImage = results[index++]
        }
        responseData.hobbyImages = results.slice(index)

        res.status(200).json(responseData)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getPinInfo = async (req, res) => {
    const { userId } = req.params

    try {
        const user = await UserModel.findById(userId).select('birthday hobbies')

        const today = new Date()
        let daysUntilBirthday = null
        if (user.birthday) {
            const birthday = new Date(user.birthday)
            birthday.setFullYear(today.getFullYear()) // Set birthday to this year
            if (birthday < today) birthday.setFullYear(today.getFullYear() + 1) // If birthday has passed this year, set to next year
            daysUntilBirthday = Math.ceil(
                (birthday - today) / (1000 * 60 * 60 * 24)
            )
        }

        const formattedHobbies = user.hobbies.join(', ')

        res.json({
            daysUntilBirthday,
            hobbies: formattedHobbies,
        })
    } catch (error) {
        console.error('Error fetching user additional info:', error)
        res.status(500).json({ message: 'Server error' })
    }
}
