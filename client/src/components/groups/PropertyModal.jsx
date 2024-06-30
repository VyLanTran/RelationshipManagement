import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { Pencil, Trash2, CirclePlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "../ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import BASE_URL from '@/../../constants.js'
import { EditPropertyModal } from "./EditPropertyModal.jsx";

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
        <div className="pl-[10px] pr-[10px] pt-[10px] text-left">
            <TooltipProvider>
                <Tooltip>
                    <EditPropertyModal groupId={groupId} checkRefresh={checkRefresh} setCheckRefresh={setCheckRefresh}  init_label="" description="">
                        <TooltipTrigger asChild>
                            <button className="ml-[5px] text-slate-400 hover:text-black" variant="outline" size="icon">
                                <CirclePlus size={36} strokeWidth={1.5} absoluteStrokeWidth/>
                            </button>
                        </TooltipTrigger>
                    </EditPropertyModal>
                    <TooltipContent className="bg-gray-100">
                        <p>Add Property</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            
            {properties.length > 0 ?
            <Table>
                <TableCaption>Some interesting tidbits about your group so far!</TableCaption>
                <TableBody className="text-left">
                    {properties.length > 0 ? properties.map((property) => (
                        <TableRow>
                            <TableCell className="w-[30%] text-xl">{property.name}</TableCell>
                            <TableCell className="">{property.subject}</TableCell>
                            <TableCell className="w-[12vh]">
                                <TooltipProvider>
                                    <Tooltip>
                                        <EditPropertyModal groupId={groupId} checkRefresh={checkRefresh} setCheckRefresh={setCheckRefresh} init_label={property.name} description={property.subject}>
                                            <TooltipTrigger asChild>
                                                <button
                                                    className="text-slate-400 hover:text-black"
                                                    variant="outline" size="icon">
                                                    <Pencil size={24} strokeWidth={1.5} />
                                                </button>
                                            </TooltipTrigger>
                                        </EditPropertyModal>
                                    </Tooltip>
                                </TooltipProvider>
                                <button
                                    className="text-slate-400 hover:text-black ml-[10px]"
                                    variant="outline" size="icon" onClick={() => handleDelete(property)}>
                                    <Trash2 size={24} strokeWidth={1.5} />
                                </button>
                            </TableCell>
                        </TableRow>
                    )) : <></>}
                </TableBody>
            </Table>
            : <Table><TableCaption>Oh no! There is nothing here yet! Create some!</TableCaption></Table>}
        </div>
    )
}