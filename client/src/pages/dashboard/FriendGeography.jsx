import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ResponsiveChoropleth } from '@nivo/geo'

import { Spinner } from '../../components/ui/spinner.jsx'
import { geoData } from '../../utils/geoData.js'
import { Box } from '@mui/material'

const FriendGeography = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const token = useSelector((state) => state.auth.token)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getFriendGeography = async () => {
            try {
                setIsLoading(true)
                const res = await fetch(`${BASE_URL}/users/friendGeography`, {
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
                setIsLoading(false)
            }
        }

        getFriendGeography()
    }, [])

    return (
        <div className="px-[5%] py-6  w-full h-full">
            <Box
                mt="40px"
                height="75vh"
                border={`1px solid `}
                borderRadius="4px"
            >
                {!isLoading ? (
                    <div
                        style={{
                            backgroundColor: '#def5fc',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <ResponsiveChoropleth
                            data={data}
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
                            features={geoData.features}
                            margin={{ top: 0, right: 0, bottom: 0, left: -50 }}
                            colors="YlOrRd"
                            domain={[0, 50]}
                            unknownColor="#666666"
                            label="properties.name"
                            valueFormat=".2s"
                            projectionScale={122}
                            projectionTranslation={[0.45, 0.6]}
                            projectionRotation={[0, 0, 0]}
                            borderWidth={0.5}
                            borderColor="#120201"
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: true,
                                    translateX: 0,
                                    translateY: -125,
                                    itemsSpacing: 0,
                                    itemWidth: 94,
                                    itemHeight: 18,
                                    itemDirection: 'left-to-right',
                                    itemTextColor: '#000000',
                                    itemOpacity: 0.85,
                                    symbolSize: 18,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#a28834',
                                                itemOpacity: 1,
                                            },
                                        },
                                    ],
                                },
                            ]}
                        />
                    </div>
                ) : (
                    <Spinner />
                )}
            </Box>
        </div>
    )
}

export default FriendGeography
