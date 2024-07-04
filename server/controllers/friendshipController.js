import FriendshipModel from '../models/FriendshipModel.js'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

export const getYearRange = async (req, res) => {
    try {
        const userId = req.user._id

        const agg = [
            {
                $match: {
                    $or: [{ user1: userId }, { user2: userId }],
                },
            },
            {
                $project: {
                    years: {
                        $concatArrays: [
                            [{ $year: '$establishedAt' }],
                            [{ $year: '$dissolvedAt' }],
                        ],
                    },
                },
            },
            {
                $unwind: '$years',
            },
            {
                $group: {
                    _id: null,
                    firstYear: { $min: '$years' },
                    lastYear: { $max: '$years' },
                },
            },
            {
                $project: {
                    _id: 0,
                    firstYear: 1,
                    lastYear: 1,
                },
            },
        ]

        const result = await FriendshipModel.aggregate(agg)

        if (result.length > 0) {
            const { firstYear, lastYear } = result[0]
            return res.status(200).json({ firstYear, lastYear })
        } else {
            return res.status(200).json({ firstYear: null, lastYear: null })
        }
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

const generateContinuousTimeline = (firstYear, lastYear) => {
    const timeline = []
    for (let year = firstYear; year <= lastYear; year++) {
        for (let month = 1; month <= 12; month++) {
            timeline.push({
                year,
                month,
                established: 0,
                dissolved: 0,
                cumulativeFriends: 0,
            })
        }
    }
    return timeline
}

export const getFriendshipTimeline = async (req, res) => {
    try {
        const userId = req.user._id

        const yearRangeAgg = [
            {
                $match: {
                    $or: [{ user1: userId }, { user2: userId }],
                },
            },
            {
                $project: {
                    years: {
                        $concatArrays: [
                            [{ $year: '$establishedAt' }],
                            [{ $year: '$dissolvedAt' }],
                        ],
                    },
                },
            },
            {
                $unwind: '$years',
            },
            {
                $group: {
                    _id: null,
                    firstYear: { $min: '$years' },
                    lastYear: { $max: '$years' },
                },
            },
            {
                $project: {
                    _id: 0,
                    firstYear: 1,
                    lastYear: 1,
                },
            },
        ]

        const yearRangeResult = await FriendshipModel.aggregate(yearRangeAgg)

        if (yearRangeResult.length === 0) {
            return res.status(200).json([])
        }

        const { firstYear, lastYear } = yearRangeResult[0]

        const friendshipAgg = [
            {
                $match: {
                    $or: [{ user1: userId }, { user2: userId }],
                },
            },
            {
                $project: {
                    year: { $year: '$establishedAt' },
                    month: { $month: '$establishedAt' },
                    dissolvedYear: { $year: '$dissolvedAt' },
                    dissolvedMonth: { $month: '$dissolvedAt' },
                },
            },
            {
                $facet: {
                    established: [
                        {
                            $group: {
                                _id: { year: '$year', month: '$month' },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { '_id.year': 1, '_id.month': 1 } },
                    ],
                    dissolved: [
                        {
                            $group: {
                                _id: {
                                    year: '$dissolvedYear',
                                    month: '$dissolvedMonth',
                                },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { '_id.year': 1, '_id.month': 1 } },
                    ],
                },
            },
        ]

        const friendshipResult = await FriendshipModel.aggregate(friendshipAgg)

        const establishedData = friendshipResult[0].established
        const dissolvedData = friendshipResult[0].dissolved

        const continuousTimeline = generateContinuousTimeline(
            firstYear,
            lastYear
        )

        let cumulativeFriends = 0
        const finalTimeline = continuousTimeline.map((entry) => {
            const establishedEntry = establishedData.find(
                (e) => e._id.year === entry.year && e._id.month === entry.month
            )
            const dissolvedEntry = dissolvedData.find(
                (d) => d._id.year === entry.year && d._id.month === entry.month
            )

            const established = establishedEntry ? establishedEntry.count : 0
            const dissolved = dissolvedEntry ? dissolvedEntry.count : 0

            cumulativeFriends += established - dissolved

            return {
                year: entry.year,
                month: entry.month,
                established,
                dissolved,
                cumulativeFriends,
            }
        })

        return res.status(200).json(finalTimeline)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const getAnniversary = async (req, res) => {
    try {
        const { otherUserId } = req.params
        const userObjectId = new ObjectId(req.user._id)
        const otherUserObjectId = new ObjectId(otherUserId)

        const friendship = await FriendshipModel.findOne({
            $or: [
                { user1: userObjectId, user2: otherUserObjectId },
                { user1: otherUserObjectId, user2: userObjectId },
            ],
        })

        if (!friendship) {
            return res.status(404).json({ message: 'Friendship not found' })
        }

        const establishedDate = new Date(friendship.establishedAt)
        const today = new Date()
        const yearsDiff = today.getFullYear() - establishedDate.getFullYear()
        const nextAnniversary = new Date(
            establishedDate.setFullYear(today.getFullYear())
        )

        if (nextAnniversary < today) {
            nextAnniversary.setFullYear(today.getFullYear() + 1)
        }

        const daysUntilAnniversary = Math.ceil(
            (nextAnniversary - today) / (1000 * 3600 * 24)
        )

        let anniversaryMessage = null

        const date = `${nextAnniversary.toLocaleString('default', { month: 'long' })} ${nextAnniversary.getDate()}`
        const time = `${yearsDiff + 1}`

        res.status(200).json({
            date: date,
            time: time,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
