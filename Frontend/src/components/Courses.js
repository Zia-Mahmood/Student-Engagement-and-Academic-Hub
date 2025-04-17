import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:3000/api";

const Courses = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    description: "",
  });
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty1, setSelectedFaculty1] = useState("");
  const [selectedFaculty2, setSelectedFaculty2] = useState("");
  const [resources, setResources] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(url + "/isAuth", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userSession = await response.json();
          setUserName(userSession.name);
          setUserEmail(userSession.email);
          setUserPosition(userSession.position);
        } else {
          const errorData = await response.text();
          console.log("User is not authenticated:", errorData);
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred during Authentication");
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch(url + "/courses/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchFaculty = async () => {
      try {
        const response = await fetch(url + "/faculty/list", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch faculty");
        const data = await response.json();
        setFacultyList(data);
      } catch (err) {
        console.log("Error fetching faculty:", err);
      }
    };

    checkAuth();
    fetchCourses();
    fetchFaculty();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async () => {
    try {
      const newCourseData = {
        ...newCourse,
        faculty: [selectedFaculty1, selectedFaculty2].filter(Boolean),
        resources: resources.split(",").map((r) => r.trim()),
      };

      const response = await fetch(url + "/courses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to add course");
      }

      const added = await response.json();
      setCourses((prev) => [...prev, added.savedCourse]);
      setOpenModal(false);
      setNewCourse({ code: "", name: "", description: "" });
      setSelectedFaculty1("");
      setSelectedFaculty2("");
      setResources("");
      window.location.reload();
    } catch (err) {
      alert("Error adding course: " + err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${url}/courses/delete/${courseId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete course");

      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (err) {
      alert("Error deleting course: " + err.message);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {error && <Typography color="error">{error}</Typography>}
      {(userPosition === "admin" || userPosition === "faculty") && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ marginBottom: 2 }}
        >
          Add Course
        </Button>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Course
          </Typography>
          <TextField
            label="Code"
            name="code"
            fullWidth
            margin="normal"
            value={newCourse.code}
            onChange={handleInputChange}
          />
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={newCourse.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            value={newCourse.description}
            onChange={handleInputChange}
          />

          <Typography variant="subtitle1" mt={2}>
            Select Faculty 1
          </Typography>
          <TextField
            select
            fullWidth
            value={selectedFaculty1}
            onChange={(e) => setSelectedFaculty1(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">Select Faculty</option>
            {facultyList.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </TextField>

          <Typography variant="subtitle1" mt={2}>
            Select Faculty 2
          </Typography>
          <TextField
            select
            fullWidth
            value={selectedFaculty2}
            onChange={(e) => setSelectedFaculty2(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">Select Faculty</option>
            {facultyList.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </TextField>

          <TextField
            label="Resources (comma-separated)"
            fullWidth
            margin="normal"
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            multiline
            rows={2}
          />

          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddCourse}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              onClick={() => handleCourseClick(course._id)}
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
                height: 200, // You can increase/decrease this value
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6" align="center">
                  {course.name}
                </Typography>
                {(userPosition === "admin" || userPosition === "faculty") && (
                  <Box mt={2} display="flex" justifyContent="center">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click navigation
                        handleDeleteCourse(course._id);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Courses;
