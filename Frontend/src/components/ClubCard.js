import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, CardActionArea, Card, CardContent, Avatar, Typography, CardMedia } from "@mui/material";


const url = "http://localhost:3000/api";

const ClubCard = ({ club }) => {

    return (
        <Card variant="outlined" sx={{ display: "flex", flexDirection: "column", borderRadius: 2, overflow: "hidden", height: "100%"}}>
            <CardActionArea component={Link} to={`/clubs/${club.cid}`} sx={{ flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor:"#323d52", backfaceVisibility:"visible" }}>
                <CardMedia
                    component="img"
                    height="140"                  // fixed height for all images
                    image={url+club.logo}
                    alt={club.name}
                    sx={{ objectFit: "cover", opacity: 0.8 }}
                />

                <CardContent sx={{ flexGrow: 0, pt: 1,alignSelf:"flex-start",}}>
                    <Box display="flex" mb={1}>
                        <Avatar
                            src={url+club.logo}
                            alt={club.name}
                            sx={{ width: 60, height: 60, mr: 1, }}
                        />
                    </Box>
                    
                    <Typography variant="h6" sx={{ whiteSpace: "initial" ,color:"#ffffff" }}>{club.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "initial",textAlign:"left",color:"#ffffff" }}>
                        {club.moto || "   "}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card >);
};

export default ClubCard;