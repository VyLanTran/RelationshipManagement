import React, { useEffect, useState } from 'react'
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { useDispatch, useSelector } from "react-redux"
import BASE_URL from '@/../../constants.js'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from "lucide-react";

import axios from "axios";

export function EditPropertyModal() {


    return (
        <p>Test</p>
    )
}