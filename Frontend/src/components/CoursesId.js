import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
  Paper,
  Modal,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useUser } from "../context/userContext";

const url = "http://localhost:3000/api";

const CourseId = () => {
  const { user } = useUser();
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const [editingField, setEditingField] = useState(null); // e.g., 'description', 'resources', 'faculty'
  const [editedValue, setEditedValue] = useState(""); // For description
  const [editedResources, setEditedResources] = useState([]); // For resources
  const [editedFaculty, setEditedFaculty] = useState([]); // For faculty IDs

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${url}/reviews/course/${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
    fetchReviews();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`${url}/courses/${courseId}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch course");
      }
      const data = await response.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reviewer: user._id,
          course: courseId,
          rating,
          comment,
        }),
      });
      if (res.ok) {
        alert("Review submitted!");
        setOpen(false);
        setRating(1);
        setComment("");
        // Refetch reviews after successful submission
        const newRes = await fetch(`${url}/reviews/course/${courseId}`);
        const newReviews = await newRes.json();
        setReviews(newReviews);
      } else {
        const err = await res.json();
        alert("Failed to submit review: " + err.message);
      }
    } catch (err) {
      console.error("Error submitting review", err);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const res = await fetch(`${url}/reviews/delete/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Review deleted!");
        // Refresh reviews
        const newRes = await fetch(`${url}/reviews/course/${courseId}`);
        const newReviews = await newRes.json();
        setReviews(newReviews);
      } else {
        const err = await res.json();
        alert("Failed to delete review: " + err.message);
      }
    } catch (err) {
      console.error("Error deleting review", err);
    }
  };

  const handleCourseUpdate = async (updatedFields) => {
    try {
      const res = await fetch(`${url}/courses/update/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        await fetchCourse();

        setEditingField(null);
        setEditedValue("");
        setEditedResources([]);
        setEditedFaculty([]);
      } else {
        const err = await res.json();
        alert("Failed to update course: " + err.message);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!course)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ padding: 4, maxWidth: "800px", margin: "auto" }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {course.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Code: {course.code}
          </Typography>
          <Box display="flex" alignItems="center">
            {editingField === "description" ? (
              <>
                <textarea
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  rows={3}
                  style={{ width: "100%", marginRight: 8 }}
                />
                <button
                  onClick={() =>
                    handleCourseUpdate({ description: editedValue })
                  }
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <Typography
                  variant="body1"
                  gutterBottom
                  color="textPrimary"
                  sx={{ flex: 1 }}
                >
                  {course.description || "No description available"}
                </Typography>
                {(user?.position === "admin" ||
                  user?.position === "faculty") && (
                  <button
                    onClick={() => {
                      setEditingField("description");
                      setEditedValue(course.description || "");
                    }}
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Faculty
          </Typography>
          {editingField === "faculty" ? (
            <Box>
              <label>Enter Faculty IDs (comma separated):</label>
              <input
                value={editedFaculty.join(",")}
                onChange={(e) =>
                  setEditedFaculty(
                    e.target.value.split(",").map((f) => f.trim())
                  )
                }
                style={{ width: "100%" }}
              />
              <button
                onClick={() => handleCourseUpdate({ faculty: editedFaculty })}
              >
                Save
              </button>
            </Box>
          ) : (
            <>
              {course.faculty?.length > 0 ? (
                <List dense>
                  {course.faculty.map((fac) => (
                    <ListItem key={fac._id}>
                      <ListItemText primary={fac.name} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">
                  No faculty assigned
                </Typography>
              )}
              {(user?.position === "admin" || user?.position === "faculty") && (
                <button
                  onClick={() => {
                    setEditingField("faculty");
                    setEditedFaculty(course.faculty?.map((f) => f._id) || []);
                  }}
                >
                  Edit
                </button>
              )}
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Resources
          </Typography>
          {editingField === "resources" ? (
            <Box>
              <textarea
                rows={4}
                value={editedResources.join("\n")}
                onChange={(e) => setEditedResources(e.target.value.split("\n"))}
                style={{ width: "100%" }}
              />
              <button
                onClick={() =>
                  handleCourseUpdate({ resources: editedResources })
                }
              >
                Save
              </button>
            </Box>
          ) : (
            <>
              {course.resources?.length > 0 ? (
                <List dense>
                  {course.resources.map((res, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={res} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">
                  No resources available
                </Typography>
              )}
              {(user?.position === "admin" || user?.position === "faculty") && (
                <button
                  onClick={() => {
                    setEditingField("resources");
                    setEditedResources(course.resources || []);
                  }}
                >
                  Edit
                </button>
              )}
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Reviews
          </Typography>
          {reviews.length > 0 ? (
            <List>
              {reviews.map((review) => (
                <ListItem key={review._id} alignItems="flex-start">
                  <Paper
                    elevation={2}
                    sx={{ padding: 2, width: "100%", position: "relative" }}
                  >
                    <Typography variant="subtitle2" color="text.primary">
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 1 }}
                      color="text.primary"
                    >
                      {review.comment || review.content}
                    </Typography>
                    {review.rating && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                        color="text.primary"
                      >
                        ⭐ {review.rating}/5
                      </Typography>
                    )}

                    {/* Admin delete button */}
                    {(user?.position === "admin" ||
                      user?._id === review.reviewer?._id) && (
                      <button
                        onClick={() => handleDelete(review._id)}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "#d32f2f",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </Paper>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">No reviews yet</Typography>
          )}

          {user?.position !== "faculty" && (
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <button
                onClick={() => setOpen(true)}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add Review
              </button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
            width: 400,
          }}
        >
          <h2>Add Your Review</h2>
          <label>Rating (1-5):</label>
          <input
            type="number"
            value={rating}
            min={1}
            max={5}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <Box sx={{ textAlign: "right" }}>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CourseId;
