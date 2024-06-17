import React, { useEffect, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { ResponsiveBar } from '@nivo/bar'
import { Box } from '@mui/material'
import NoData from '../../components/dashboard/NoData.jsx'

const InteractionReport = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const token = useSelector((state) => state.auth.token)
    const today = dayjs()
    const [startDate, setStartDate] = useState(dayjs('2022-01-01'))
    const [endDate, setEndDate] = useState(today)
    const [mostIteractionsData, setMostInteractionsData] = useState([])

    useEffect(() => {
        const fetchMostInteractions = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/messages/mostInteractions/?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
                    {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )

                const json = await res.json()
                if (!res.ok) {
                    throw new Error(json.error)
                } else {
                    setMostInteractionsData(json)
                }
            } catch (error) {
                console.error('Error fetching year range:', error)
            }
        }

        fetchMostInteractions()
    }, [startDate, endDate])

    return (
        <div className="px-[5%] py-6  w-full h-full">
            {/* <Box m="1.5rem 2.5rem"> */}
            <Box height="70vh">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="flex flex-row gap-4 justify-center ">
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                        />
                    </div>
                </LocalizationProvider>

                {mostIteractionsData.length > 0 ? (
                    <div className="w-full h-full mt-8 flex flex-col justify-center items-center">
                        <div className="text-gray-500 text-[18px] font-semibold">
                            Top <span>{mostIteractionsData.length}</span> people
                            in your friend list who you have been interacting
                            with the most
                        </div>
                        <div className="w-full h-full max-auto">
                            <ResponsiveBar
                                data={mostIteractionsData}
                                keys={['messageCount']}
                                indexBy="friendName"
                                width={800}
                                margin={{
                                    top: 50,
                                    right: 130,
                                    bottom: 100,
                                    left: 60,
                                }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={{ scheme: 'nivo' }}
                                borderColor={{
                                    from: 'color',
                                    modifiers: [['darker', 1.6]],
                                }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: -45,

                                    legendPosition: 'middle',
                                    legendOffset: 32,
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: 'Number of Messages',
                                    legendPosition: 'middle',
                                    legendOffset: -40,
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{
                                    from: 'color',
                                    modifiers: [['darker', 1.6]],
                                }}
                                animate={true}
                                motionStiffness={90}
                                motionDamping={15}
                            />
                        </div>
                    </div>
                ) : (
                    <NoData />
                )}
            </Box>
            {/* </Box> */}
        </div>
    )
}

export default InteractionReport
