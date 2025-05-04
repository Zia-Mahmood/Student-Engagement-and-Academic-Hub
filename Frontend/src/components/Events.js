import { Grid, Box, TextField, IconButton, Typography, Divider, CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState, useCallback, useRef } from "react";
import EventCard from "./EventCard";

const url = "http://localhost:3000/api";

const Events = ({ }) => {
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [events, setEvents] = useState([]);
    const [ongoingEvents, setOngoingEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [query, setQuery] = useState('');
    const [overview, setOverview] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(24);          // items per page
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // fetch a page of events
    const fetchEvents = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${url}/events?page=${page}&limit=${limit}`,
                { credentials: 'include' }
            );
            const data = await res.json();
            setEvents(prev => [...prev, ...data.events]);
            console.log(data)
            // decide if more pages exist
            const totalPages = Math.ceil(data.total / limit);
            setHasMore(page < totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, loading, hasMore]);


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

        const fetchOngoingEvents = async () => {
            try {
                const response = await fetch(url + "/getOngoingEvents", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch reports");
                }
                const data = await response.json();
                console.log(data);
                setOngoingEvents(data.events);
                setLoading(false);
            }
            catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchUpcomingEvents = async () => {
            try {
                const response = await fetch(url + "/getUpcomingEvents", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch reports");
                }
                const data = await response.json();
                console.log(data);
                setUpcomingEvents(data.events);
                setLoading(false);
            }
            catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        checkAuth();
        fetchOngoingEvents();
        fetchUpcomingEvents();
    }, []);

    useEffect(() => {
        fetchEvents();
    },[page]);

    const observer = useRef();
    const lastEventRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);


    const handleSearch = () => {
        setIsTyping(true);
        setShowSearchResults(true);
        console.log('Searching for:', query);
    }

    return (
        <Box sx={{ height: "100vh", }}>
            {loading && (
                <Box textAlign="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}

            {!hasMore && !loading && (
                <Box textAlign="center" mt={2}>
                    End of events
                </Box>
            )}
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
            {showSearchResults ? <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3, overflowY: true, backgroundColor: "#3e6354", borderRadius: "20px", }}>
                <Typography sx={{ m: "10px 0", p: "8px 15px", width: "fit-content", maxWidth: "98%", whiteSpace: "pre-line", wordWrap: "break-word", overflowWrap: "break-word", color: "white", textAlign: "left" }}>
                    {isTyping && "Typing.... Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."}
                </Typography>
            </Box> :
                <></>}

            {
                showSearchResults ? <></> :
                    <Box sx={{ mt: "30px" }}>

                        <Divider textAlign="left" color="#ffffff" sx={{
                            fontSize: "20px", "&::before, &::after": {
                                borderColor: "white",
                            },
                        }} ><Typography sx={{ color: "white", fontSize: "20px" }}>Ongoing Events</Typography></Divider>
                        {ongoingEvents.length > 0 ? <Grid container spacing={2} alignItems="stretch">
                            {ongoingEvents.map((event, index) => (
                                <Grid
                                    item
                                    key={event._id}
                                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                >
                                    <EventCard event={event} />
                                </Grid>
                            ))}
                        </Grid> : <Typography variant="h6" sx={{ ml: "30px", display: "block", whiteSpace: "initial", color: "#ffffff", width: "90%" }}>{"No Ongoing Events Found"}</Typography>}
                    </Box>
            }

            {
                showSearchResults ? <></> :
                    <Box sx={{ mt: "30px" }}>

                        <Divider textAlign="left" color="#ffffff" sx={{
                            fontSize: "20px", "&::before, &::after": {
                                borderColor: "white",
                            },
                        }} ><Typography sx={{ color: "white", fontSize: "20px" }}>Upcoming Events</Typography></Divider>
                        {upcomingEvents.length > 0 ? <Grid container spacing={2} alignItems="stretch">
                            {upcomingEvents.map((event, index) => (
                                <Grid
                                    item
                                    key={event._id}
                                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                >
                                    <EventCard event={event} />
                                </Grid>
                            ))}
                        </Grid> : <Typography variant="h6" sx={{ ml: "30px", display: "block", whiteSpace: "initial", color: "#ffffff", width: "90%" }}>{"No Upcoming Events Found"}</Typography>}
                    </Box>
            }

            {
                showSearchResults ? <></> :
                    <Box sx={{ mt: "30px" }}>

                        <Divider textAlign="left" color="#ffffff" sx={{
                            fontSize: "20px", "&::before, &::after": {
                                borderColor: "white",
                            },
                        }} ><Typography sx={{ color: "white", fontSize: "20px" }}>Completed Events</Typography></Divider>
                        {events.length > 0 ? <Grid container spacing={2} alignItems="stretch">
                            {events.map((event, idx) => {
                                if (idx === events.length - 1) {
                                    // attach ref to last item
                                    return (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={event._id} ref={lastEventRef} sx={{width:"25%"}}>
                                            <EventCard event={event} />
                                        </Grid>
                                    );
                                } else {
                                    return (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={event._id} sx={{width:"24%"}}>
                                            <EventCard event={event} />
                                        </Grid>
                                    );
                                }
                            })}
                        </Grid> : <Typography variant="h6" sx={{ ml: "30px", display: "block", whiteSpace: "initial", color: "#ffffff", width: "90%" }}>{"No Completed Events Found"}</Typography>}
                    </Box>
            }



        </Box>
    );
};

export default Events;