import React from "react";
import { Link } from 'react-router-dom';
import { Box, CardActionArea, Card, CardContent, Typography, CardMedia } from '@mui/material';


const url = "http://localhost:3000/api";

const EventCard = ({ event }) => {
    
  const startDateStr = event.datetimeperiod?.[0]?.["0"];

    const formatToIST = (dateInput) => {
        const date = new Date(dateInput);
        const options = {
          weekday: 'short',        // "Sat"
          day: 'numeric',          // "5"
          month: 'short',          // "Apr"
          hour: 'numeric',         // "3"
          minute: '2-digit',       // "00"
          hour12: true,            // 12‑hour clock
          timeZone: 'Asia/Kolkata',
          timeZoneName: 'short',   // "IST"
        };
      
        // This will produce something like "Sat, 5 Apr, 3:00 PM IST"
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }

    return (
        <Card variant="outlined" sx={{ display: "flex", flexDirection: "column", borderRadius: 2, overflow: "hidden", height: "100%" }}>
            <CardActionArea component={Link} to={`/events/${event._id}`} sx={{ flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor: "#323d52", backfaceVisibility: "visible" }}>
                <CardMedia
                    component="img"
                    height="400"                  // fixed height for all images
                    image={url + event.poster}
                    alt={event.name}
                    sx={{ objectFit: "cover", opacity: 0.8, }}
                />

                <CardContent sx={{ flexGrow: 0, pt: 1, alignSelf: "flex-start", }}>
                    

                    <Typography variant="h6" sx={{ whiteSpace: "initial", color: "#ffffff" }}>{event.name || " "}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "initial", textAlign: "left", color: "#ffffff" }}>
                        {startDateStr?formatToIST(startDateStr):"---"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card >);
};

export default EventCard;