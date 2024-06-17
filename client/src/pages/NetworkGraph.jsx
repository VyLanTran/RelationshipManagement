import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { LuExternalLink } from 'react-icons/lu'

const NetworkGraph = () => {
    const token = useSelector((state) => state.auth.token)
    const userId = useSelector((state) => state.auth.user._id)
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

    const d3Container = useRef(null)
    const [graphData, setGraphData] = useState({ nodes: [], links: [] })
    const [selectedUser, setSelectedUser] = useState(null)

    const RADIUS_FRIEND = 10
    const RADIUS_CURRENT = 30

    const [searchKeyword, setSearchKeyword] = useState('')

    useEffect(() => {
        const width = 928
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
                    .distance(200)
            )
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .on('tick', ticked)

        // D3.js rendering setup
        const svg = d3
            .select(d3Container.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto;')

        const link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(graphData.links)
            .join('line')
            .attr('stroke-width', (d) => 1.5)

        const node = svg
            .append('g')

            .selectAll('circle')
            .data(graphData.nodes)
            .join('circle')
            .attr('r', (d) =>
                d.id === userId ? RADIUS_CURRENT : RADIUS_FRIEND
            ) // Highlight current user node
            .attr('stroke', (d) => (d.id === userId ? '#000' : '#fff'))
            .attr('stroke-width', (d) => (d.id === userId ? 3 : 1.5))
            .attr('fill', 'none')
            .call(drag(simulation))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)
            .on('click', handleNodeClick)

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
        <div className="flex flex-row w-full h-screen bg-[#f2f1ea]">
            <div className="w-[70%] flex  py-6 flex-col items-center">
                <div className="flex flex-col gap-8">
                    <div class="w-[500px] h-[45px] mx-auto rounded-lg shadow-md">
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
                                onChange={(e) =>
                                    setSearchKeyword(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="text-[22px]">
                        You are connecting to {graphData.nodes.length - 1}{' '}
                        people. Let's expand your circle of friends
                    </div>
                </div>

                <div className="pb-auto pt-[-50px]">
                    <svg ref={d3Container} className="flex-grow" />
                </div>
            </div>

            <div className="w-[30%] h-full overflow-y-auto ">
                {selectedUser && (
                    <div className="absolute p-4 bg-white border right-0 border-gray-300 ">
                        <button
                            className="absolute top-2 right-2 text-xl font-bold"
                            onClick={() => setSelectedUser(null)}
                        >
                            &times;
                        </button>
                        <img
                            src={selectedUser.profilePictureUrl}
                            alt={selectedUser.name}
                            className="w-24 h-24 rounded-full mt-4 mb-4 mx-auto"
                        />

                        <NavLink to={`/users/${selectedUser.id}`}>
                            <div className="flex flex-row gap-2 justify-center items-center pb-10 font-bold">
                                <div className="text-[20px] font-bold">
                                    {selectedUser.name}
                                </div>
                                <div className="font-bold text-[#bf9b30]">
                                    <LuExternalLink size={16} />
                                </div>
                            </div>
                        </NavLink>
                        <div className="flex flex-col text-[12px]">
                            <div class="grid grid-cols-5 gap-4">
                                <div class="col-span-1 text-left font-bold">
                                    Phone
                                </div>
                                <div class="col-span-4 text-left">
                                    {selectedUser.phone}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    Email
                                </div>
                                <div class="col-span-4 text-left">
                                    {selectedUser.email}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    Company
                                </div>
                                <div class="col-span-4 text-left">
                                    {selectedUser.company}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    School
                                </div>
                                <div class="col-span-4 text-left">
                                    {selectedUser.school}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    Live in
                                </div>
                                <div class="col-span-4 text-left">
                                    {selectedUser.currentCity}
                                </div>

                                <div class="col-span-1 text-left font-bold">
                                    Come from
                                </div>
                                <div class="col-span-4 text-left">
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
