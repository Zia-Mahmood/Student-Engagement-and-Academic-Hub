import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Card, CardContent, CircularProgress } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from "axios";

const url = "http://localhost:3000/api";

const Calendar = ({}) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (month, year) => {
    setLoading(true);
    try {
      const res = await axios.get(url+`/by-month?month=${month}&year=${year}`);
      console.log(res)
      setEvents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedDate.month() + 1, selectedDate.year());
  }, [selectedDate]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Events Calendar
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Events in {selectedDate.format("MMMM YYYY")}
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : events.length === 0 ? (
            <Typography>No events in this month.</Typography>
          ) : (
            events.map((event) => (
              <Card key={event._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(event.date).format("DD MMM YYYY")}
                  </Typography>
                  <Typography variant="body1">{event.description}</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calendar;