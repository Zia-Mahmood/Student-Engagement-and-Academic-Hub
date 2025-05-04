
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import { Box, Typography, CircularProgress, Avatar, TextField, IconButton, Grid, Card, CardContent, Button, CardActions, CardMedia, Container, Paper, Tabs, Tab, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatIcon from '@mui/icons-material/Chat';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import Groups2Icon from '@mui/icons-material/Groups2';
import MailIcon from '@mui/icons-material/Mail';
import EventCard from "./EventCard";
import UserCard from "./UserCard";


function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ py: 2 }}>{children}</Box> : null;
}


const url = "http://localhost:3000/api";
const ClubDetail = ({ }) => {
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [events, setEvents] = useState([]);
    const [members, setMembers] = useState([]);
    const { clubId } = useParams();
    const [club, setClub] = useState(null);
    const [query, setQuery] = useState('');
    const [overview, setOverview] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [insta, setInsta] = useState("");

    const [tab, setTab] = React.useState(0);

    const handleTabChange = (_, newValue) => {
        setTab(newValue);
    };

    const handleSearch = () => {
        setIsTyping(true);
        console.log('Searching for:', query);
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(url + "/isAuth", {
                    method: 'GET',
                    withCredntials: true,
                    credentials: 'include'
                })
                if (response.ok) {
                    const userSession = await response.json();
                    console.log(userSession);
                    setUserName(userSession.name);
                    setUserEmail(userSession.email);
                    setUserPosition(userSession.position);
                    return;
                }
                else {
                    const errorData = await response.text();
                    console.log('User is not authenticated:', errorData);
                }
            } catch (error) {
                console.log(error);
                setError('An error occurred during Authentication');
            }
        };

        const fetchClub = async () => {
            try {
                const response = await fetch(url + `/getClub/${clubId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch club details");
                }
                const data = await response.json();
                console.log(data);
                setClub(data.club);
                const ins = data.club.contact.insta.split("/").pop().split("?");
                if (ins.length > 0) {
                    ins.pop();
                    setInsta(ins.pop());
                }
                else {
                    const inst = data.club.contact.insta.split("/");
                    inst.pop()
                    console.log(inst);
                    setInsta(inst.pop());
                }
                setLoading(false);
            }
            catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchClubEvents = async () => {
            try{
                const response = await fetch(url+`/getClubEvents/${clubId}`,{
                    method:"GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
            console.log("hello")
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch events");
                }
                const data = await response.json();
                console.log(data);
                setEvents(data.events);
                setLoading(false);
            }catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        const fetchClubMembers = async () => {
            try{
                const response = await fetch(url+`/getClubMembers/${clubId}`,{
                    method:"GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch members");
                }
                const data = await response.json();
                console.log(data);
                setMembers(data.members);
                setLoading(false);
            }catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        checkAuth();
        fetchClub();
        fetchClubEvents();
        fetchClubMembers();
    }, []);



    if (loading) return <CircularProgress />;
    if (!club) return <Typography>Club not found</Typography>;
    return (
        <Box sx={{ height: "100vh", backgroundColor:""}}>

            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
                <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{
                        flex: 1,
                        backgroundColor: "#fff",
                        color: "#b3b3cc",
                        marginRight: 1,
                        borderRadius: "5px",
                    }}
                />
                <IconButton sx={{ color: "#b3b3cc" }} onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3, overflowY: true, backgroundColor: "#3e6354", borderRadius: "20px", }}>
                <Typography sx={{ m: "10px 0", p: "8px 15px", width: "fit-content", maxWidth: "98%", whiteSpace: "pre-line", wordWrap: "break-word", overflowWrap: "break-word", color: "white", textAlign: "left" }}>
                    {isTyping && "Typing.... Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."}
                </Typography>
            </Box>

            <Box>
                {/* 1. Hero banner */}
                <Box
                    sx={{
                        height: 300,
                        backgroundImage: `url(${url + club.banner})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        borderRadius: "10px",
                    }}
                />
                <Box sx={{ ml: "10px" }}>
                    <Box
                        sx={{
                            display: 'flex',
                            mt: "30px"
                        }}
                    >
                        <Box display="flex" mb={1}>
                            <Avatar
                                src={url + club.logo}
                                alt={club.name}
                                sx={{ width: 100, height: 100, mr: 1, }}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: "column", alignSelf: "center", ml: "15px"
                        }}>
                            <Typography variant="h4" sx={{ display: "block", whiteSpace: "pre-line", color: "#ffffff", width: "100%" }}>{club.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "initial", textAlign: "left", color: "#b0bfba", width: "100%", fontSize: "16px", mt: "5px" }}>
                                {club.moto || "   "}
                            </Typography>
                        </Box >

                    </Box>
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', textAlign: "left", color: "#ffffff", width: "100%", fontSize: "17px", mt: "5px" }}>
                        {club.description}
                    </Typography>
                    <Button variant="contained" size="large" href={club.joinLink}>
                        Join Us
                    </Button>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: "row",
                        mt: "10px"
                    }}>
                        {club.contact.mail && <Box component="a" sx={{ display: 'flex', flexDirection: "row", ':hover': { backgroundColor: 'rgb(75, 72, 72)' }, p: "5px", borderRadius: "5px" }} href={`mailto:${club.contact.mail}`}>
                            <MailIcon sx={{ color: "#b0bfba" }} />
                            <Typography variant="body2" sx={{ alignSelf: 'center', ml: "10px", color: "#b0bfba" }}>
                                {club.contact.mail}
                            </Typography>
                        </Box>}

                        {club.contact.facebook && <Box component="a" sx={{ ml: "10px", display: 'flex', flexDirection: "row", ':hover': { backgroundColor: 'rgb(75, 72, 72)' }, p: "5px", borderRadius: "5px" }} href={`${club.contact.facebook}`}>
                            <FacebookIcon sx={{ color: "#3d59d4" }} />
                            <Typography variant="body2" sx={{ alignSelf: 'center', ml: "10px", color: "#3d59d4" }}>
                                {club.contact.facebook.split("/").pop()}
                            </Typography>
                        </Box>}

                        {club.contact.insta && <Box component="a" sx={{ ml: "10px", display: 'flex', flexDirection: "row", ':hover': { backgroundColor: 'rgb(75, 72, 72)' }, p: "5px", borderRadius: "5px" }} href={`${club.contact.insta}`}>
                            <InstagramIcon sx={{ color: "#d66ded" }} />
                            <Typography variant="body2" sx={{ alignSelf: 'center', ml: "10px", color: "#d66ded" }}>
                                {insta}
                            </Typography>
                        </Box>}

                        {club.contact.linkedin && <Box component="a" sx={{ display: 'flex', flexDirection: "row", ':hover': { backgroundColor: 'rgb(75, 72, 72)' }, p: "5px", borderRadius: "5px" }} href={`${club.contact.linkedin}`}>
                            <LinkedInIcon sx={{ color: "#b0bfba" }} />
                            <Typography variant="body2" sx={{ alignSelf: 'center', ml: "10px", color: "#b0bfba" }}>
                                {club.contact.linkedin.split("/").pop()}
                            </Typography>
                        </Box>}

                        {club.contact.discord && <Box component="a" sx={{ display: 'flex', flexDirection: "row", ':hover': { backgroundColor: 'rgb(75, 72, 72)' }, p: "5px", borderRadius: "5px" }} href={`${club.contact.discord}`}>
                            <ChatIcon sx={{ color: "#3d59d4" }} />
                            <Typography variant="body2" sx={{ alignSelf: 'center', ml: "10px", color: "#3d59d4" }}>
                                {"Discord"}
                            </Typography>
                        </Box>}

                        {club.contact.whatsapp && <Box component="a" sx={{ display: 'flex', flexDirection: "row", ':hover': { backgroundColor: 'rgb(75, 72, 72)' }, p: "5px", borderRadius: "5px" }} href={`${club.contact.whatsapp}`}>
                            <WhatsAppIcon sx={{ color: "#0bbf38" }} />
                            <Typography variant="body2" sx={{ alignSelf: 'center', ml: "10px", color: "#0bbf38" }}>
                                {"WhatsApp"}
                            </Typography>
                        </Box>}
                    </Box>

                    <Divider sx={{ borderRadius: 1, borderStyle: "dotted", mt: "20px", backgroundColor: "#ffffff" }} />

                    <Box sx={{ mt: "30px" }}>
                        <Box sx={{ display: 'flex', flexDirection: "row", mt: "10px" }}>
                            <LocalActivityIcon sx={{ ml: "20px", color: "#ffffff", alignSelf: "center" }} fontSize='small' />
                            <Typography variant="h5" sx={{ ml: "10px", display: "block", whiteSpace: "pre-line", color: "#ffffff", width: "100%" }}>{"Events"}</Typography>
                        </Box>
                        {events.length>0?<Grid container spacing={2} alignItems="stretch">
                            {events.map((event, index) => (
                                <Grid
                                    item
                                    key={event._id}
                                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                >
                                    <EventCard event={event} />
                                </Grid>
                            ))}
                        </Grid>:<Typography variant="h6" sx={{ ml: "30px", display: "block", whiteSpace: "initial", color: "#ffffff", width: "90%" }}>{"No Events Found"}</Typography>}
                    </Box>

                    <Divider sx={{ borderRadius: 1, borderStyle: "dotted", mt: "20px", backgroundColor: "#ffffff" }} />

                    <Box sx={{ mt: "30px" }}>
                        <Box sx={{ display: 'flex', flexDirection: "row", mt: "10px" }}>
                            <Groups2Icon sx={{ ml: "20px", color: "#ffffff", alignSelf: "center" }} fontSize='medium' />
                            <Typography variant="h5" sx={{ ml: "10px", display: "block", whiteSpace: "pre-line", color: "#ffffff", width: "100%" }}>{"Members"}</Typography>
                        </Box>
                        {members.length>0?<Grid container spacing={2} alignItems="stretch" sx={{mt:"20px", ml:"20px"}}>
                            {members.map((user, index) => (
                                <Grid
                                    item
                                    key={user.userId}
                                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                    sx={{':hover': { backgroundColor: 'rgb(87, 87, 87)' },p:"8px",borderRadius:"5px"}}
                                >
                                    <UserCard user={user} />
                                </Grid>
                            ))}
                        </Grid>:<Typography variant="h6" sx={{ ml: "30px", display: "block", whiteSpace: "initial", color: "#ffffff", width: "90%" }}>{"No Members Found"}</Typography>}
                    </Box>
                </Box>

                
            </Box>
        </Box>
    );
};

export default ClubDetail;