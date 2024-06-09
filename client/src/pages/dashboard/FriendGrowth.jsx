import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useEffect, useState } from 'react'

import FriendGrowthChart from '../../components/dashboard/FriendGrowthChart.jsx'
import { useSelector } from 'react-redux'
import NoData from '../../components/dashboard/NoData.jsx'

const FriendGrowth = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const token = useSelector((state) => state.auth.token)

    const [year, setYear] = useState('')
    const [yearRange, setYearRange] = useState([])

    useEffect(() => {
        const fetchYearRange = async () => {
            try {
                const res = await fetch(`${BASE_URL}/friendship/getYearRange`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                })

                const json = await res.json()
                if (!res.ok) {
                    throw new Error(json.error)
                } else {
                    const { firstYear, lastYear } = json
                    if (firstYear && lastYear) {
                        const years = []
                        for (let y = firstYear; y <= lastYear; y++) {
                            years.push(y)
                        }
                        setYearRange(years)
                        setYear(firstYear.toString())
                    }
                }
            } catch (error) {
                console.error('Error fetching year range:', error)
            }
        }

        fetchYearRange()
    }, [])

    return (
        <div className="px-[5%] py-6  w-full h-full">
            {yearRange.length <= 0 ? (
                <NoData />
            ) : (
                <Box m="1.5rem 2.5rem">
                    <Box height="75vh">
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel>Year</InputLabel>

                            <Select
                                value={year}
                                label="Year"
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {yearRange.map((yearOption) => (
                                    <MenuItem
                                        key={yearOption}
                                        value={yearOption}
                                    >
                                        {yearOption}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {year && <FriendGrowthChart year={year} />}
                    </Box>
                </Box>
            )}
        </div>
    )
}

export default FriendGrowth
