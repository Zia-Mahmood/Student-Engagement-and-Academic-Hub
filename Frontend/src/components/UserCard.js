import React from "react";
import { Link } from 'react-router-dom';
import { Box, CardActionArea, Card, CardContent, Avatar, Typography, CardMedia } from '@mui/material';

const url = "http://localhost:3000/api";

const UserCard = ({ user }) => {

    const getYear = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d) ? null : d.getFullYear();
      };

    return (
        <Box display="flex" flexDirection="column" alignItems={'center'} sx={{}}>
            <Box display="flex" mb={1}>
                <Avatar
                    src={url}
                    alt={user.name}
                    sx={{ width: 150, height: 150, mr: 1, }}
                />
            </Box>
            <Box display="flex" flexDirection="column" alignItems={"center"}>
                <Typography variant="body2" sx={{ whiteSpace: "initial" ,color:"#ffffff", fontSize:"16px"}}>{user.name}</Typography>
                {user.memberships.map((m,idx) => {
                    const startYear = getYear(m.startDate);
                    const endYearRaw = getYear(m.endDate);
                    // if no endDate or endDate is in the future, show "present"
                    const endDisplay =
                      !endYearRaw || new Date(m.endDate) < new Date(m.startDate)
                        ? "present"
                        : endYearRaw;
          
                    const displayText = `${m.role} (${startYear || "?"} - ${endDisplay})`;
          
                    return (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{ color: "#ffffff", fontSize: "14px" }}
                      >
                        {displayText}
                      </Typography>
                    );
                })}
            </Box>
        </Box>
    );
}


export default UserCard;