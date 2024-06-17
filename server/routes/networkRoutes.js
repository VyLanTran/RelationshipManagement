import express from 'express'

import { verifyAuth } from '../middleware/auth.js'
import { getUserNetwork } from '../controllers/networkController.js'

const router = express.Router()

router.use(verifyAuth)

router.get(
    '/:userId',
    (req, res, next) => {
        try {
            req.neo4jSession = req.app.locals.neo4jDriver.session()
            console.log(
                'Neo4j session created successfully for user:',
                req.params.userId
            )
            next()
        } catch (error) {
            console.error('Error creating Neo4j session:', error)
            res.status(500).json({ error: 'Failed to create Neo4j session' })
        }
    },
    async (req, res) => {
        try {
            await getUserNetwork(req, res)
        } catch (error) {
            console.error('Error in getUserNetwork:', error)
            res.status(500).json({ error: 'Failed to fetch user network' })
        } finally {
            if (req.neo4jSession) {
                req.neo4jSession.close()
                console.log('Neo4j session closed successfully.')
            }
        }
    }
)

export default router
