import { Grid, Box } from "@mui/material";
import React, { useEffect, useState } from "react";

const url = "http://localhost:3000/api";

const Clubs = ({ }) => {



    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [clubs, setClubs] = useState([]);
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
                const response = await fetch(url + "/getClubs", {
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
                //setClubs(data.c);
                //setLoading(false);
            }
            catch (err) {
                setError(err.message);
                //setLoading(false);
            }
        };
        checkAuth();
    }, []);


    return (
        <Box>
            <Box>



                <Grid container spacing={1}>
                    {clubs.map((club, index) => (
                        <Grid item xs={3} sm={3} md={3} key={index}>

                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default Clubs;