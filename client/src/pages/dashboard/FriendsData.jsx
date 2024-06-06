import { useSelector } from 'react-redux'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import React from 'react'
import { Box } from '@mui/material'

const FriendsData = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)

    const [isLoading, setIsLoading] = useState(false)
    const [friends, setFriends] = useState([])

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 0.8,
        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            flex: 0.6,
            renderCell: (params) => {
                const phoneNumber = params.value
                return phoneNumber
                    ? phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})/, '($1)$2-$3')
                    : ''
            },
        },
        {
            field: 'company',
            headerName: 'Company',
            flex: 1,
        },
        {
            field: 'school',
            headerName: 'School',
            flex: 0.8,
        },
        {
            field: 'currentCity',
            headerName: 'City',
            flex: 0.8,
        },
    ]

    useEffect(() => {
        const getAllFriends = async () => {
            setIsLoading(true)
            const res = await fetch(
                `${BASE_URL}/users/${currentUser._id}/friends`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            const json = await res.json()
            setFriends(json)
            setIsLoading(false)
        }

        getAllFriends()
    }, [])

    return (
        <div className="px-[5%] py-6 flex w-full h-full">
            <Box
                width="100%"
                height="80vh"
                sx={{
                    backgroundColor: 'white',
                    overflowX: 'auto',
                    borderRadius: '0%',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#fce7ac',
                        borderBottom: 'none',
                    },
                }}
            >
                <DataGrid
                    loading={isLoading}
                    getRowId={(row) => row._id}
                    rows={friends || []}
                    columns={columns}
                    slots={{ toolbar: CustomGridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                />
            </Box>
        </div>
    )
}

const CustomGridToolbar = (props) => (
    <div style={{ paddingBottom: '20px', paddingTop: '20px' }}>
        {' '}
        <GridToolbar {...props} />
    </div>
)

export default FriendsData
