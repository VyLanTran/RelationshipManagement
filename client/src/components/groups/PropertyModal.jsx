import React from "react";
import { MdEdit } from 'react-icons/md'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table";

export function PropertyModal() {

    return (
        <div className="pt-[40px]">
            <Table className="">
                <TableCaption>Some interesting tidbits about your group so far!</TableCaption>
                <TableBody className="text-left">
                    <TableRow>
                    <TableCell className="w-[23%] font-medium">Fun fact</TableCell>
                    <TableCell className="">Linh is the coolest person in the room</TableCell>
                    <TableCell className="w-[10%]"><button className="flex items-center justify-center font-azeret bg-[#FFB302] w-[5vh] text-[4vh] font-bold border h-[5vh] rounded-[10px] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"><MdEdit/></button></TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell className="w-[23%] font-medium">Who's sleepy?</TableCell>
                    <TableCell className="">Definitely not Jimmy</TableCell>
                    <TableCell className="w-[10%]"><button className="flex items-center justify-center font-azeret bg-[#FFB302] w-[5vh] text-[4vh] font-bold border h-[5vh] rounded-[10px] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"><MdEdit/></button></TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell className="w-[23%] font-medium">Who loves cats the most?</TableCell>
                    <TableCell className="">Idk dont ask me</TableCell>
                    <TableCell className="w-[10%]"><button className="flex items-center justify-center font-azeret bg-[#FFB302] w-[5vh] text-[4vh] font-bold border h-[5vh] rounded-[10px] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"><MdEdit/></button></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}