import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ResponsiveLine } from '@nivo/line'

import { Spinner } from '../../components/ui/spinner.jsx'

const FriendGrowthChart = ({ year, isDashboard = false }) => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const token = useSelector((state) => state.auth.token)

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const getFriendshipTimeline = async () => {
            try {
                setIsLoading(true)
                const res = await fetch(`${BASE_URL}/friendship/timeline`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (!res.ok) {
                    throw Error('Failed to fetch data')
                }

                const json = await res.json()
                setData(json)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setIsLoading(false) // Set loading state to false when done fetching
            }
        }

        getFriendshipTimeline()
    }, [])

    useEffect(() => {
        const filteredData = data.filter((item) => item.year === parseInt(year))

        const formattedData = filteredData.map((item) => ({
            x: new Date(0, item.month - 1).toLocaleString('default', {
                month: 'short',
            }),
            y: item.cumulativeFriends,
        }))

        setChartData([
            {
                id: 'Friendships',
                color: '#000000',
                data: formattedData,
            },
        ])
    }, [year, data])

    return !isLoading ? (
        <ResponsiveLine
            data={chartData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: '#000000',
                        },
                    },
                    legend: {
                        text: {
                            fill: '#000000',
                        },
                    },
                    ticks: {
                        line: {
                            stroke: '#000000',
                            strokeWidth: 1,
                        },
                        text: {
                            fill: '#000000',
                        },
                    },
                },
                legends: {
                    text: {
                        fill: '#000000',
                    },
                },
                tooltip: {
                    container: {
                        color: '#000000',
                    },
                },
            }}
            margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 0,
                max: 'auto',
                stacked: false,
                reverse: false,
            }}
            enableArea={isDashboard}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                format: (v) => {
                    return v
                },
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? '' : 'Month',
                legendOffset: 36,
                legendPosition: 'middle',
            }}
            axisLeft={{
                orient: 'left',
                tickValues: 5,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? '' : 'Number of Friends',
                legendOffset: -60,
                legendPosition: 'middle',
            }}
            enableGridX={true}
            enableGridY={true}
            pointSize={5}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
        />
    ) : (
        <Spinner />
    )
}

export default FriendGrowthChart
