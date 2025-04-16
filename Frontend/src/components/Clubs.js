import { Grid, Box, TextField, IconButton,Typography} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClubCard from "./ClubCard";
import React, { useEffect, useState } from "react";

const url = "http://localhost:3000/api";

const Clubs = ({ }) => {



    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [clubs, setClubs] = useState([]);
    const [query, setQuery] = useState('');
    const [overview, setOverview] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState("");

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

        const fetchClubs = async () => {
            try {
                const response = await fetch(url + "/getAllClubs", {
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
                setClubs(data.clubs);
                //setLoading(false);
            }
            catch (err) {
                setError(err.message);
                //setLoading(false);
            }
        };
        checkAuth();
        fetchClubs();
    }, []);

    const handleSearch = () => {
        setIsTyping(true);
        console.log('Searching for:', query);
    }


    return (
        <Box sx={{ height: "100vh", }}>

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

            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3, overflowY:true, backgroundColor:"#3e6354",borderRadius:"20px", }}>
                    <Typography sx={{m:"10px 0", p:"8px 15px", width:"fit-content", maxWidth:"98%",whiteSpace:"pre-line",wordWrap:"break-word", overflowWrap:"break-word", color:"white",textAlign:"left" }}>
                        {isTyping && "Typing.... Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."}
                    </Typography>
            </Box>

            <Grid container spacing={2} alignItems="stretch">
                {clubs.map((club, index) => (
                    <Grid
                        item
                        key={club._id}
                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    >
                        <ClubCard club={club} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Clubs;