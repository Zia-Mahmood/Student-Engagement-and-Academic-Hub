import {
    Grid,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Modal,
    TextField,
    Select, 
    MenuItem,
    InputLabel,
    FormControl
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import DeleteIcon from "@mui/icons-material/Delete";
  
  const url = "http://localhost:3000/api";
  
  const Research = () => {
    const [userPosition, setUserPosition] = useState("");
    const [projectsList, setProjectsList] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [subscribedEmails, setSubscribedEmails] = useState([]); // To store subscribed emails
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [newProject, setNewProject] = useState({
      title: "",
      description: "",
      status: "ongoing",
      collaborators: "",
      startDate: "",
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
  
      const fetchProjects = async () => {
        try {
          const response = await fetch(url + "/projects/all", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          setProjectsList(data);
        } catch (err) {
          setError("Failed to load projects list.");
        }
      };
  
      const fetchFaculty = async () => {
        try {
          const response = await fetch(url + "/faculty/list", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          const filteredFaculty = data.filter(faculty => faculty.isResearcher);
          setFacultyList(filteredFaculty);
        } catch (err) {
          setError("Failed to load faculty list.");
        }
      };
  
      checkAuth();
      fetchProjects();
      fetchFaculty()
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewProject((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleAddProject = async () => {
      try {
        const payload = {
          ...newProject,
          collaborators: newProject.collaborators
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== ""),
        };
  
        const response = await fetch(url + "/projects/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) throw new Error("Failed to add project");
  
        const added = await response.json();
        setProjectsList((prev) => [...prev, added]);
        setOpenModal(false);
        setNewProject({
          title: "",
          description: "",
          status: "ongoing",
          collaborators: "",
          startDate: "",
        });
  
        // Log the email list to console when a project is added
        console.log("Emails to notify:", subscribedEmails);

        subscribedEmails.forEach((email) => {
            console.log(`Sending email to: ${email}`);
            console.log(`Email content:`);
            console.log(`
              Subject: New Research Project Added
              Dear Subscriber,
      
              A new research project titled "${added.title}" has been added.
      
              Project Details:
              Title: ${added.title}
              Description: ${added.description}
              Status: ${added.status}
              Collaborators: ${added.collaborators.join(", ")}
              Start Date: ${new Date(added.startDate).toLocaleDateString()}
      
              You can find more details here: http://localhost:3001/projects
      
              Best Regards,
              Research Team
            `);
          });
      } catch (err) {
        alert("Error adding project: " + err.message);
      }
    };
  
    const handleSubscribe = (email) => {
      setSubscribedEmails((prev) => [...prev, email]);
      alert("You have successfully subscribed for notifications.");
    };
  
    const handleDeleteProject = async (id) => {
      if (userPosition !== "admin") {
        alert("You do not have permission to delete this project.");
        return;
      }
  
      if (!window.confirm("Are you sure you want to delete this project?"))
        return;
  
      try {
        const response = await fetch(`${url}/projects/delete/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) throw new Error("Failed to delete project");
  
        setProjectsList((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        alert("Error deleting project: " + err.message);
      }
    };
  
    const handleCardClick = (projectId) => {
      navigate(`/projects/${projectId}`);
    };
  
    return (
      <Box sx={{ padding: 4 }}>
        {error && <Typography color="error">{error}</Typography>}
  
        {userPosition === "admin" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)}
              sx={{ marginBottom: 2 }}
            >
              Add Project
            </Button>
  
            {/* Subscribe Button */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                const email = prompt("Enter your email to subscribe:");
                if (email) handleSubscribe(email);
              }}
              sx={{ marginBottom: 2 }}
            >
              Subscribe
            </Button>
          </Box>
        )}
  
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              maxHeight: "80vh", 
              overflowY: "auto", 
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add New Research Project
            </Typography>
  
            {[
              "title",
              "description",
              "status",
              "startDate",
            ].map((field) => (
              <TextField
                key={field}
                label={field[0].toUpperCase() + field.slice(1)}
                name={field}
                fullWidth
                margin="normal"
                multiline={field === "description"}
                rows={field === "description" ? 2 : 1}
                value={newProject[field]}
                onChange={handleInputChange}
                type={field === "startDate" ? "date" : "text"}
              />
            ))}
  
            <TextField
              label="Collaborators (comma-separated)"
              name="collaborators"
              fullWidth
              margin="normal"
              value={newProject.collaborators}
              onChange={handleInputChange}
            />
  
            <FormControl fullWidth margin="normal">
              <InputLabel id="faculty-select-label">Faculty</InputLabel>
              <Select
                labelId="faculty-select-label"
                name="facultyId"
                value={newProject.facultyId || ""}
                onChange={handleInputChange}
                label="Faculty"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {facultyList.map((faculty) => (
                  <MenuItem key={faculty._id} value={faculty._id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button onClick={() => setOpenModal(false)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddProject}>
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
  
        <Grid container spacing={3}>
          {projectsList.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
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
                <Box onClick={() => handleCardClick(p._id)} sx={{ width: "100%", height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6">{p.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.description}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      Status: {p.status}
                    </Typography>
                    {p.startDate && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Start Date: {new Date(p.startDate).toLocaleDateString()}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Faculty: {p.faculty.name}
                    </Typography>
                    {p.collaborators?.length > 0 && (
                      <Typography variant="body2" color="text.secondary" display="block">
                        Collaborators: {p.collaborators.join(", ")}
                      </Typography>
                    )}
  
                    {userPosition === "admin" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 10,
                          minWidth: "auto",
                          padding: "2px 6px",
                          borderRadius: "50%",
                          minHeight: "auto",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(p._id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    )}
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  export default Research;
  