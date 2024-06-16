import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "../ui/table";
import BASE_URL from '@/../../constants.js'

export function PropertyModal({groupId}) {

    const [properties, setProperties] = useState([]);
    const [checkRefresh, setCheckRefresh] = useState(true);
    const token = useSelector((state) => state.auth.token)
    const authHeader = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    }

    useEffect(() => {
        const getProperties = async () => {
            const res = await fetch(`${BASE_URL}/properties/${groupId}`, authHeader)
            const data = await res.json()
            if (res.ok) {
                setProperties(data.properties)
            }
            console.log(data)
        }   
        if (groupId) {
            getProperties();
        }
    }, [groupId, checkRefresh]);

    const handleDelete = async (e) => {
        const res = await fetch(`${BASE_URL}/properties/` + e._id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        setCheckRefresh(!checkRefresh)
    }

    return (
        <div className="p-[10px]">
            <Table className="">
                <TableCaption>Some interesting tidbits about your group so far!</TableCaption>
                <TableBody className="text-left">
                    {properties.length > 0 ? properties.map((property) => (
                        <TableRow>
                            <TableCell className="w-[23%] font-medium">{property.name}</TableCell>
                            <TableCell className="">{property.subject}</TableCell>
                            <TableCell className="w-[10%]">
                                <button
                                    className="text-slate-400 hover:text-black"
                                    variant="outline" size="icon">
                                    <Pencil size={36} strokeWidth={2} />
                                </button>
                                <button
                                    className="text-slate-400 hover:text-black ml-[10px]"
                                    variant="outline" size="icon" onClick={() => handleDelete(property)}>
                                    <Trash2 size={36} strokeWidth={2} />
                                </button>
                            </TableCell>
                        </TableRow>
                    )) : <p></p>}
                </TableBody>
            </Table>
        </div>
    )
}