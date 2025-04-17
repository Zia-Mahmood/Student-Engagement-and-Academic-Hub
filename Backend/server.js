const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const clubRoutes = require("./routes/clubRoutes");
const eventRoutes = require("./routes/eventRoutes");
const courseRoutes = require("./routes/courseRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const projectRoutes = require("./routes/projectRoutes");
const aiRoutes = require("./routes/aiRoutes");

const {
  refreshSession,
  requireAuth,
  requireRole,
} = require("./middlewares/userMiddleware");
const {
  clubExists,
  requireMembership,
} = require("./middlewares/clubMiddleware");

const app = express();

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 6001;
const uri = process.env.DATABASE_CONNECTION_STRING;

const mongoDBstore = new MongoDBStore({
  uri,
  collection: "localSessions",
});

// MIDDLEWARES
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(refreshSession);

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);

    console.log("Connected to MongoDB!");

    await mongoose.connection.db.admin().ping();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

connectToMongoDB();

// SESSIONS HANDLER
const MAX_AGE = 1000 * 60 * 30; // 30 minutes
app.use(
  session({
    secret: "DUB_NATION",
    name: "session-id",
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE,
      secure: false, // Only set to true in production
    },
    rolling: true, // Reset session maxAge on each request
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api", userRoutes);
app.use("/api", clubRoutes);
app.use("/api", eventRoutes);
app.use("/api/images", express.static("images"));
app.use("/api/courses", courseRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", aiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
