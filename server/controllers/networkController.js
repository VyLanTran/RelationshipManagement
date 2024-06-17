export const getUserNetwork = async (req, res) => {
    const { userId } = req.params
    const neo4jSession = req.neo4jSession

    try {
        const nodes = []
        const links = []
        const uniqueNodeIds = new Set()
        const uniqueLinkKeys = new Set()

        const userRes = await neo4jSession.run(
            `MATCH (u:User {id: $userId}) RETURN u`,
            { userId }
        )
        const currentUser = userRes.records[0].get('u').properties
        nodes.push(currentUser)
        uniqueNodeIds.add(currentUser.id)

        const friendRes = await neo4jSession.run(
            `MATCH (u:User {id: $userId})-[:FRIEND]->(f:User) RETURN f`,
            { userId }
        )

        friendRes.records.forEach((record) => {
            const friend = record.get('f').properties
            nodes.push(friend)
            uniqueNodeIds.add(friend.id)
        })

        const linkRes = await neo4jSession.run(
            `MATCH (u:User)-[:FRIEND]-(f:User)
             WHERE u.id IN $userIds AND f.id IN $userIds
             RETURN DISTINCT u.id AS source, f.id AS target`,
            { userIds: Array.from(uniqueNodeIds) }
        )

        linkRes.records.forEach((record) => {
            const source = record.get('source')
            const target = record.get('target')

            // Ensure source and target are sorted to prevent duplicate links
            const linkKey = [source, target].sort().join('-')

            // Add to links only if it's not already present
            if (!uniqueLinkKeys.has(linkKey)) {
                links.push({ source, target })
                uniqueLinkKeys.add(linkKey)
            }
        })

        res.status(200).json({ nodes, links })
    } catch (error) {
        res.status(404).json({ error: error.message })
    } finally {
        neo4jSession.close()
    }
}
