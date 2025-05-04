import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  Card,
  CardContent,
  Divider,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useUser } from "../context/userContext";

const url = "http://localhost:3000/api";

const FacultyId = () => {
  const { user } = useUser();
  const { id: facultyId } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);

  useEffect(() => {
    fetchFaculty();
    fetchReviews();
  }, [facultyId]);

  const fetchFaculty = async () => {
    try {
      const res = await fetch(`${url}/faculty/${facultyId}`);
      if (!res.ok) throw new Error("Failed to fetch faculty details");
      const data = await res.json();
      setFaculty(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${url}/reviews/faculty/${facultyId}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const res = await fetch(`${url}/reviews/faculty/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // if using JWT
        },
        body: JSON.stringify({
          Faculty: facultyId,
          reviewer: user._id,
          comment,
          rating,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      setComment("");
      setRating(3);
      setOpen(false);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!faculty)
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
            {faculty.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Email: {faculty.email || "N/A"}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Department: {faculty.department || "N/A"}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Office Hours: {faculty.officeHours || "N/A"}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Approach Instructions: {faculty.approachInstructions || "N/A"}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Researcher: {faculty.isResearcher ? "Yes" : "No"}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Interests: {faculty.interests?.join(", ") || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {faculty.bio || "No bio available"}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Reviews
            </Typography>
            {(user?.positon === "member" || user?.position === "admin") && (
              <Button variant="contained" onClick={() => setOpen(true)}>
                Leave a Review
              </Button>
            )}
          </Box>

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
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                    {review.rating && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        ⭐ {review.rating}/5
                      </Typography>
                    )}
                  </Paper>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">No reviews yet</Typography>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            precision={0.5}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Your Review"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleReviewSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyId;
