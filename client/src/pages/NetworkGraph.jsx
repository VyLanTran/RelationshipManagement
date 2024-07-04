import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { LuExternalLink } from 'react-icons/lu'
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area'

const NetworkGraph = () => {
    const RADIUS_FRIEND = 20
    const RADIUS_CURRENT = 45
    const DISTANCE = 300

    const token = useSelector((state) => state.auth.token)
    const user = useSelector((state) => state.auth.user)
    const userId = useSelector((state) => state.auth.user._id)
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

    const d3Container = useRef(null)
    const [graphData, setGraphData] = useState({ nodes: [], links: [] })
    const [selectedUser, setSelectedUser] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const friendIds = useSelector((state) => state.auth.user.friendIds)
    const [isFriend, setIsFriend] = useState(false)
    const zoom = useRef(d3.zoom().scaleExtent([0.5, 2]))

    // useEffect(() => {
    //     const fetchRecommendations = async () => {
    //         const res = await fetch(`${BASE_URL}/users/recommend`, {
    //             method: 'GET',
    //             headers: { Authorization: `Bearer ${token}` },
    //         })
    //         const data = await res.json()

    //         if (res.ok) {
    //             setRecommendations(data)
    //         } else {
    //             await fetchAllNonFriends()
    //         }
    //     }

    //     const fetchAllNonFriends = async () => {
    //         const res = await fetch(`${BASE_URL}/users/nonFriends`, {
    //             method: 'GET',
    //             headers: { Authorization: `Bearer ${token}` },
    //         })
    //         const data = await res.json()

    //         if (res.ok) {
    //             setRecommendations(data)
    //         }
    //     }

    //     fetchRecommendations()
    // }, [recommendations])

    // TODO: script to update neo4j database + update network graph
    useEffect(() => {
        const width = 1000
        const height = 600

        // Fetch graph data from backend
        const fetchGraphData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/network/${userId}`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) {
                    throw new Error('Failed to fetch network data')
                }
                const data = await res.json()
                setGraphData(data)
            } catch (error) {
                console.error('Error fetching network data:', error)
            }
        }

        fetchGraphData()

        if (graphData.nodes.length === 0) return

        // D3.js simulation setup
        const simulation = d3
            .forceSimulation(graphData.nodes)
            .force(
                'link',
                d3
                    .forceLink(graphData.links)
                    .id((d) => d.id)
                    .distance(DISTANCE)
            )
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .on('tick', ticked)

        const svg = d3
            .select(d3Container.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto; overflow: auto;')
            .call(zoom.current)

        const link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.4)
            .selectAll('line')
            .data(graphData.links)
            .join('line')
            .attr('stroke-width', (d) => 2)

        const node = svg
            .append('g')

            .selectAll('circle')
            .data(graphData.nodes)
            .join('circle')
            .attr('r', (d) =>
                d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND
            )
            .attr('stroke', (d) => (d.id === userId ? '#FFB302' : '#000'))

            .attr('stroke-width', (d) => (d.id === userId ? 8 : 1.5))
            .attr('fill', 'none')
            .attr('cursor', 'pointer')
            .call(drag(simulation))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)
            .on('click', handleNodeClick)

        // Add pin icons
        const pins = svg
            .append('g')
            .selectAll('text')
            .data(graphData.nodes.filter((d) => d.id !== userId)) // Filter out nodes where d.id === userId
            .data(graphData.nodes)
            .enter()
            .append('text')
            .attr(
                'x',
                (d) => (d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND) / 4
            )
            .attr(
                'y',
                (d) => (d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND) / 4
            )
            .attr('class', 'pin-icon')
            .text('\u{1F4CC}') // Unicode for pushpin
            .attr('font-size', 12)
            .attr('cursor', 'pointer')
            .on('click', (event, d) =>
                handlePinClick(event, d, svg, width, height)
            )
        pins.filter((d) => d.id === userId).remove()

        const nodeImages = svg
            .append('g')
            .selectAll('image')
            .data(graphData.nodes)
            .join('image')
            .attr('href', (d) => d.profilePictureUrl)
            .attr('x', (d) =>
                d.id === userId ? -RADIUS_CURRENT : -RADIUS_FRIEND
            )
            .attr('y', (d) =>
                d.id === userId ? -RADIUS_CURRENT : -RADIUS_FRIEND
            )
            .attr('width', (d) =>
                d.id === userId ? RADIUS_CURRENT * 2 : RADIUS_FRIEND * 2
            )
            .attr('height', (d) =>
                d.id === userId ? RADIUS_CURRENT * 2 : RADIUS_FRIEND * 2
            )
            .attr('cursor', 'pointer')
            .attr(
                'clip-path',
                (d) =>
                    `circle(${d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND}px)`
            )
            .call(drag(simulation))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)
            .on('click', handleNodeClick)

        const nodeLabels = svg
            .append('g')
            .selectAll('text')
            .data(graphData.nodes)
            .join('text')
            .text((d) => d.name)
            .attr('x', 15)
            .attr('dy', '.35em')
            .style('font-size', '14px')
            .style('visibility', 'hidden')

        function ticked() {
            link.attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y)

            node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)

            nodeImages
                .attr(
                    'x',
                    (d) =>
                        d.x - (d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND)
                )
                .attr(
                    'y',
                    (d) =>
                        d.y - (d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND)
                )

            nodeLabels.attr('x', (d) => d.x + 15).attr('y', (d) => d.y)

            pins.attr(
                'x',
                (d) => d.x + (d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND)
            ).attr(
                'y',
                (d) => d.y - (d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND)
            )
        }

        function handleMouseOver(event, d) {
            nodeLabels.style('visibility', (n) =>
                n === d ? 'visible' : 'hidden'
            )
        }

        function handleMouseOut() {
            nodeLabels.style('visibility', 'hidden')
        }

        function handleNodeClick(event, d) {
            setSelectedUser(d)
            setIsFriend(friendIds.includes(d.id))

            link.attr('stroke', (l) =>
                l.source.id === d.id || l.target.id === d.id
                    ? '#fc0303'
                    : '#bababa'
            )
        }

        function drag(simulation) {
            function dragStarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart()
                d.fx = d.x
                d.fy = d.y
            }

            function dragged(event, d) {
                d.fx = event.x
                d.fy = event.y
            }

            function dragEnded(event, d) {
                if (!event.active) simulation.alphaTarget(0)
                d.fx = null
                d.fy = null
            }

            return d3
                .drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded)
        }

        // Handle pin click to show/hide cards
        // function handlePinClick(event, d, svg, width, height) {
        //     const isPinned = d3.select(event.target).classed('pinned')
        //     d3.select(event.target).classed('pinned', !isPinned)

        //     if (isPinned) {
        //         svg.selectAll(`.card-${d.id}`).remove()
        //         svg.selectAll(`.line-${d.id}`).remove()
        //     } else {
        //         // Display 5-6 cards with lines
        //         const cardsData = [
        //             `Birthday reminder: 5 days until ${d.name}'s birthday`,
        //             `${d.name}'s latest post: "Had a great day at the park!"`,
        //             `Shared memory: Remember when we went to the beach?`,
        //             `Friendship duration: 3 years`,
        //             `Messages this month: 42`,
        //         ]

        //         const angleStep = (2 * Math.PI) / cardsData.length
        //         const radius = 200

        //         cardsData.forEach((cardText, i) => {
        //             const angle = i * angleStep
        //             const cardX = d.x + radius * Math.cos(angle)
        //             const cardY = d.y + radius * Math.sin(angle)

        //             svg.append('line')
        //                 .attr('class', `line-${d.id}`)
        //                 .attr('x1', d.x)
        //                 .attr('y1', d.y)
        //                 .attr('x2', cardX)
        //                 .attr('y2', cardY)
        //                 .attr('stroke', '#000')
        //                 .attr('stroke-width', 1)

        //             svg.append('foreignObject')
        //                 .attr('class', `card-${d.id}`)
        //                 .attr('x', cardX - 50)
        //                 .attr('y', cardY - 50)
        //                 .attr('width', radius)
        //                 .attr('height', 150)
        //                 .append('xhtml:div')
        //                 .style('border', '1px solid #000')
        //                 .style('background', '#fff')
        //                 .style('padding', '10px')
        //                 .style('border-radius', '8px')
        //                 .style('box-shadow', '0 0 5px rgba(0,0,0,0.3)')
        //                 .style('overflow', 'auto') // Make the card scrollable
        //                 .style('max-height', '100px') // Set max height for the card
        //                 .style('font-size', '10px') // Make text smaller
        //                 .html(`<p>${cardText}</p>`)
        //         })
        //     }
        // }

        const handlePinClick = async (event, d, svg, width, height) => {
            const isPinned = d3.select(event.target).classed('pinned')
            d3.select(event.target).classed('pinned', !isPinned)

            if (isPinned) {
                svg.selectAll(`.card-${d.id}`).remove()
                svg.selectAll(`.line-${d.id}`).remove()
            } else {
                try {
                    const res = await fetch(
                        `${BASE_URL}/messages/lastMonth/${d.id}`,
                        {
                            method: 'GET',
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )

                    if (!res.ok) {
                        throw new Error('Failed to fetch message stats')
                    }

                    const { totalMessages, daysSinceLastMessage } =
                        await res.json()

                    let totalMessagesText = `You have ${totalMessages} messages this month.`
                    if (totalMessages === 0) {
                        totalMessagesText = 'You have no messages this month.'
                    } else if (totalMessages < 20) {
                        totalMessagesText +=
                            " Let's spend more time nurturing this friendship."
                    } else {
                        totalMessagesText += ` You and ${d.name} truly care about each other.`
                    }

                    let lastMessageText
                    if (daysSinceLastMessage) {
                        lastMessageText = `${daysSinceLastMessage} days since your last message.`
                        if (daysSinceLastMessage > 30) {
                            lastMessageText += `You haven't talked to ${d.name} for a long time. Let's send ${d.name} a message.`
                        } else {
                            lastMessageText += `${d.name} must be one of your closest friends!!!`
                        }
                    } else {
                        lastMessageText = `You haven't started any conversation with ${d.name}. Let's say "Hi" to start a beautiful friend journey `
                    }

                    // Fetch user additional info
                    const additionalInfoRes = await fetch(
                        `${BASE_URL}/users/pinInfo/${d.id}`,
                        {
                            method: 'GET',
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )

                    if (!additionalInfoRes.ok) {
                        throw new Error('Failed to fetch user additional info')
                    }

                    const { daysUntilBirthday, hobbies } =
                        await additionalInfoRes.json()

                    let birthdayText = ''
                    if (daysUntilBirthday !== null) {
                        if (daysUntilBirthday === 0) {
                            birthdayText = `Today is ${d.name}'s birthday, send a message and wish ${d.name} a happy birthday!`
                        } else if (
                            daysUntilBirthday > 0 &&
                            daysUntilBirthday <= 30
                        ) {
                            birthdayText = `${daysUntilBirthday} days until ${d.name}'s birthday. Let's prepare an adorable present for ${d.name}!`
                        } else {
                            birthdayText = `${daysUntilBirthday} days until ${d.name}'s birthday.`
                        }
                    }

                    let hobbiesText = ''
                    if (hobbies.length > 0) {
                        hobbiesText = `${d.name} loves ${hobbies}`
                    }

                    const anniversaryRes = await fetch(
                        `${BASE_URL}/friendship/anniversary/${d.id}`,
                        {
                            method: 'GET',
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )

                    if (!anniversaryRes.ok) {
                        throw new Error('Failed to fetch anniversary')
                    }
                    const { date, time } = await anniversaryRes.json()
                    let anniversaryText = `${date} will be ${time} years since you and ${d.name} became friends. Look ahead to celebrate this wonderful friendship.`

                    const cardsData = [
                        totalMessagesText,
                        lastMessageText,
                        birthdayText,
                        hobbiesText,
                        anniversaryText,
                    ].filter(Boolean) // Remove empty strings

                    const angleStep = (2 * Math.PI) / cardsData.length
                    const radius = 200

                    cardsData.forEach((cardText, i) => {
                        const angle = i * angleStep
                        const cardX = d.x + radius * Math.cos(angle)
                        const cardY = d.y + radius * Math.sin(angle)

                        svg.append('line')
                            .attr('class', `line-${d.id}`)
                            .attr('x1', d.x)
                            .attr('y1', d.y)
                            .attr('x2', cardX)
                            .attr('y2', cardY)
                            // .attr('stroke', '#000')
                            // .attr('stroke-width', 1)
                            .attr('stroke', '#4f46e5') // Set line color to yellow
                            .attr('stroke-width', 5) // Thicker line

                        svg.append('foreignObject')
                            .attr('class', `card-${d.id}`)
                            .attr('x', cardX - 50)
                            .attr('y', cardY - 50)
                            .attr('width', radius)
                            .attr('height', 150)
                            .append('xhtml:div')
                            // .style('border', '1px solid #000')
                            // .style('background', '#fff')
                            .style('border', '1px solid #FFB302')
                            .style('background', '#FFB302') // Set background color to yellow
                            .style('padding', '10px')
                            .style('border-radius', '8px')
                            .style('box-shadow', '0 0 5px rgba(0,0,0,0.3)')
                            .style('overflow', 'auto')
                            .style('max-height', '100px')
                            .style('font-size', '10px')
                            .html(`<p>${cardText}</p>`)
                    })
                } catch (error) {
                    console.error('Error fetching message stats:', error)
                }
            }
        }

        return () => {
            simulation.stop()
            svg.selectAll('*').remove()
        }
    }, [graphData.nodes.length])

    useEffect(() => {
        const svg = d3.select(d3Container.current)
        svg.selectAll('circle').attr('stroke', (d) => {
            if (
                searchKeyword.length > 0 &&
                d.name.toLowerCase().includes(searchKeyword.toLowerCase())
            ) {
                return '#029c1e'
            }
            return d.id === userId ? '#000' : '#fff'
        })

        svg.selectAll('circle').attr('stroke-width', (d) => {
            if (
                searchKeyword.length > 0 &&
                d.name.toLowerCase().includes(searchKeyword.toLowerCase())
            ) {
                return 20
            }
            return d.id === userId ? 3 : 1.5
        })
    }, [searchKeyword])

    return (
        <div className="flex flex-row w-full h-full">
            <div className="w-[70%] flex flex-col items-center">
                <div className="flex flex-col gap-3">
                    <div className="w-[700px] items-center justify-center">
                        {recommendations.length > 0 && (
                            <ScrollArea className="w-[700px] whitespace-nowrap rounded-md border">
                                <div className="flex w-max space-x-4 p-4 gap-4">
                                    {recommendations.map((user, id) => (
                                        <figure key={id} className="shrink-0">
                                            <div className="overflow-hidden rounded-md">
                                                <img
                                                    className="rounded-full w-[50px] border-2 border-white"
                                                    src={
                                                        user.profilePicture.url
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                        </figure>
                                    ))}
                                </div>

                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        )}
                    </div>
                    <div className="flex flex-col justify-start bg-[#faefd4] w-[1000px] rounded-lg mb-[15px] p-[10px] shadow-lg">
                        <p className="text-3xl font-semibold mb-[5px]">
                            {'Welcome, ' + user.name}
                        </p>
                        <div className="text-[15px]">
                            You are connecting to {graphData.nodes.length - 1}{' '}
                            people. Let's expand your circle of friends
                        </div>
                    </div>
                </div>

                <div
                    className="border rounded-lg bg-[#FFF]"
                    style={{
                        width: '97%',
                        height: '525px',
                        // overflow: 'auto',
                        overflowX: 'scroll',
                        overflowY: 'scroll',
                        top: '50%',
                        left: '50%',
                    }}
                >
                    <div style={{ width: '900px', height: '550px' }}>
                        <svg ref={d3Container} width="100%" height="100%"></svg>
                    </div>
                </div>
            </div>

            <div className="w-[30%] h-full mt-[10px]">
                <div class="w-[430px] h-[45px] mx-auto rounded-lg shadow-md">
                    <div class="relative flex items-center w-full h-full rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                        <div class="grid place-items-center h-full w-12 text-gray-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        <input
                            class="peer h-full w-full outline-none text-sm text-gray-700 pr-2 "
                            type="text"
                            id="search"
                            placeholder="Search for someone in your network..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>
                {selectedUser && (
                    <div className="relative m-[10px] p-5 bg-white border right-0 border-gray-300 h-[80vh] rounded-lg justify-center">
                        <button
                            className="absolute top-2 right-2 text-xl font-bold"
                            onClick={() => setSelectedUser(null)}
                        >
                            &times;
                        </button>
                        <div>
                            {selectedUser.id !== userId ? (
                                <p className="text-slate-500 text-xl">
                                    Connection
                                </p>
                            ) : (
                                <p className="text-slate-500 text-xl">
                                    Profile
                                </p>
                            )}
                        </div>
                        <img
                            src={selectedUser.profilePictureUrl}
                            alt={selectedUser.name}
                            className="w-24 h-24 rounded-full mt-4 mb-4 mx-auto"
                        />

                        <NavLink to={`/users/${selectedUser.id}`}>
                            <div className="flex flex-row gap-2 justify-center items-center pb-10 font-bold">
                                <div className="flex flex-row items-center font-semilight">
                                    <p className="text-2xl font-bold">
                                        {' ' + selectedUser.name}
                                    </p>
                                </div>
                                <div className="font-bold text-[#bf9b30]">
                                    <LuExternalLink size={16} />
                                </div>
                            </div>
                        </NavLink>
                        {/* {isFriend && (
                            <div className="mr-4 pb-10 flex justify-center items-center">
                                <BiSolidUserCheck size={22} color="#0d941b" />
                            </div>
                        )} */}
                        <div className="flex flex-col text-[12px] px-[20px] justify-center">
                            <div class="grid grid-cols-4 gap-4">
                                <div class="col-span-1 text-left font-bold">
                                    Phone
                                </div>
                                <div class="col-span-3 text-left">
                                    {selectedUser.phone}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    Email
                                </div>
                                <div class="col-span-3 text-left">
                                    {selectedUser.email}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    Company
                                </div>
                                <div class="col-span-3 text-left">
                                    {selectedUser.company}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    School
                                </div>
                                <div class="col-span-3 text-left">
                                    {selectedUser.school}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    Live in
                                </div>
                                <div class="col-span-3 text-left">
                                    {selectedUser.currentCity}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    Come from
                                </div>
                                <div class="col-span-3 text-left">
                                    {selectedUser.hometown}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NetworkGraph
