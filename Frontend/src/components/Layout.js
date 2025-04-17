import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Toolbar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";

const url = "http://localhost:3000/api";

const Layout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    fetch(url + "/isAuth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setUser(data.name);
      })
      .catch((err) => console.error("Auth check failed", err));
  }, []);

  const goToHome = () => {
    navigate("/");
  };

  const goToClubs = () => {
    navigate("/clubs");
  };

  const goToStudentBody = () => {
    navigate("/student-bodies");
  };

  const goToEvents = () => {
    navigate("/events");
  };

  const goToCalendar = () => {
    navigate("/calendar");
  };

  const goToJoinClub = () => {
    navigate("/join-club");
  };

  const goToCourses = () => {
    navigate("/courses");
  };

  const goToFacultyProfiles = () => {
    navigate("/faculty");
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "rgb(34, 34, 34)",
        overflow: "auto",
      }}
    >
      {/* Left Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: 280,
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "rgb(51, 50, 50)",
            color: "#b3b3cc",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Box component="div" sx={{ mb: "5px" }}>
            <Box
              component="img"
              sx={{
                width: "40%",
                height: "40%",
                ml: "30px",
                mt: "20px",
              }}
              src="/clubs-logo.png"
              alt="IIITH Logo"
            />
          </Box>
          <List sx={{ paddingTop: 2 }}>
            <ListItem
              button
              sx={{
                ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                width: "96%",
                ml: "5px",
                mr: "5px",
                borderRadius: "5px",
              }}
              onClick={() => goToHome()}
            >
              <ListItemIcon sx={{ color: "#b3b3cc" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              sx={{
                ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                width: "96%",
                ml: "5px",
                mr: "5px",
                borderRadius: "5px",
              }}
              onClick={() => goToClubs()}
            >
              <ListItemIcon sx={{ color: "#b3b3cc" }}>
                <ExploreRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Clubs" />
            </ListItem>
            <ListItem
              button
              sx={{
                ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                width: "96%",
                ml: "5px",
                mr: "5px",
                borderRadius: "5px",
              }}
              onClick={() => goToStudentBody()}
            >
              <ListItemIcon sx={{ color: "#b3b3cc" }}>
                <Groups2RoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Student Bodies" />
            </ListItem>
            <ListItem
              button
              sx={{
                ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                width: "96%",
                ml: "5px",
                mr: "5px",
                borderRadius: "5px",
              }}
              onClick={() => goToEvents()}
            >
              <ListItemIcon sx={{ color: "#b3b3cc" }}>
                <LocalActivityRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </ListItem>
            <ListItem
              button
              sx={{
                ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                width: "96%",
                ml: "5px",
                mr: "5px",
                borderRadius: "5px",
              }}
              onClick={() => goToCalendar()}
            >
              <ListItemIcon sx={{ color: "#b3b3cc" }}>
                <CalendarMonthRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItem>
            <ListItem
              button
              sx={{
                ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                width: "96%",
                ml: "5px",
                mr: "5px",
                borderRadius: "5px",
              }}
              onClick={() => goToJoinClub()}
            >
              <ListItemIcon sx={{ color: "#b3b3cc" }}>
                <HowToRegRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Join Club" />
            </ListItem>
            <ListItem
              button
              sx={{
                ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                width: "96%",
                ml: "5px",
                mr: "5px",
                borderRadius: "5px",
              }}
              onClick={() => goToCourses()}
            >
              <ListItemIcon sx={{ color: "#b3b3cc" }}>
                <HowToRegRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Courses" />
            </ListItem>
            <ListItem
              button
              sx={{
                ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                width: "96%",
                ml: "5px",
                mr: "5px",
                borderRadius: "5px",
              }}
              onClick={() => goToFacultyProfiles()}
            >
              <ListItemIcon sx={{ color: "#b3b3cc" }}>
                <Groups2RoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Faculty Profiles and Reviews" />
            </ListItem>
          </List>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ padding: 2 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<LogoutIcon />}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1, p: 1.5 }}>
        {/* <Toolbar /> same height as AppBar/Toolbar */}
        {/* This is where routed pages will render */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
