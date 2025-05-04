import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:3000/api";

const Faculty = () => {
  const [userPosition, setUserPosition] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    department: "",
    bio: "",
    officeHours: "",
    approachInstructions: "",
    isResearcher: false,
    interests: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(url + "/isAuth", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userSession = await response.json();
          setUserPosition(userSession.position);
        }
      } catch (error) {
        setError("Auth check failed.");
      }
    };

    const fetchFaculty = async () => {
      try {
        const response = await fetch(url + "/faculty/list", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setFacultyList(data);
      } catch (err) {
        setError("Failed to load faculty list.");
      }
    };

    checkAuth();
    fetchFaculty();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFaculty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddFaculty = async () => {
    try {
      const payload = {
        ...newFaculty,
        interests: newFaculty.interests
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      };

      const response = await fetch(url + "/faculty/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to add faculty");

      const added = await response.json();
      setFacultyList((prev) => [...prev, added]);
      setOpenModal(false);
      setNewFaculty({
        name: "",
        email: "",
        department: "",
        bio: "",
        officeHours: "",
        approachInstructions: "",
        isResearcher: false,
        interests: "",
      });
    } catch (err) {
      alert("Error adding faculty: " + err.message);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?"))
      return;

    try {
      const response = await fetch(`${url}/faculty/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete faculty");

      setFacultyList((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert("Error deleting faculty: " + err.message);
    }
  };

  const handleCardClick = (facultyId) => {
    navigate(`/faculty/${facultyId}`);
  };

  return (
    <Box sx={{ padding: 4 }}>
      {error && <Typography color="error">{error}</Typography>}

      {userPosition === "admin" && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ marginBottom: 2 }}
        >
          Add Faculty
        </Button>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "80vh", // Limit the height
            overflowY: "auto", // Enable vertical scroll
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Faculty
          </Typography>

          {[
            "name",
            "email",
            "department",
            "bio",
            "officeHours",
            "approachInstructions",
          ].map((field) => (
            <TextField
              key={field}
              label={field[0].toUpperCase() + field.slice(1)}
              name={field}
              fullWidth
              margin="normal"
              multiline={field === "bio" || field === "approachInstructions"}
              rows={field === "bio" || field === "approachInstructions" ? 2 : 1}
              value={newFaculty[field]}
              onChange={handleInputChange}
            />
          ))}

          <TextField
            label="Interests (comma-separated)"
            name="interests"
            fullWidth
            margin="normal"
            value={newFaculty.interests}
            onChange={handleInputChange}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="isResearcher"
                checked={newFaculty.isResearcher}
                onChange={handleInputChange}
              />
            }
            label="Is Researcher?"
          />

          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddFaculty}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Grid container spacing={3}>
        {facultyList.map((f) => (
          <Grid item xs={12} sm={6} md={4} key={f._id}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
                height: 180,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: 2,
                position: "relative",
              }}
            >
              <Box
                onClick={() => handleCardClick(f._id)}
                sx={{ width: "100%", height: "100%" }}
              >
                <CardContent>
                  <Typography variant="h6">{f.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.department}
                  </Typography>
                  {f.isResearcher && (
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Researcher
                    </Typography>
                  )}
                </CardContent>
              </Box>

              {userPosition === "admin" && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    minWidth: "auto",
                    padding: "2px 6px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card navigation
                    handleDeleteFaculty(f._id);
                  }}
                >
                  X
                </Button>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Faculty;
