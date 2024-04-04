import React from "react";
import { Link } from 'react-router-dom'

// TODO: show name when hovering over icon
interface GroupCardProps {
    group_name: string
    url: string
    participants: string[]
}

const ConnectionCard: React.FC<GroupCardProps> = ({ group_name, participants, url }) => {
    return (
        <div>
            This is a test
        </div>
    );
}

export default ConnectionCard;