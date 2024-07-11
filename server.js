const express = require("express");
const cors = require("cors"); 
const path = require("path");
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const fileUpload = require('express-fileupload');

// Initialize express app
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

app.use(fileUpload({
  limits: { fileSize: 5242880 }, // 5MB limit (optional)
  // Create uploads directory if it doesn't exist
  createParentPath: true,
}));


// Static file serving for uploads
console.log('Serving static files from:', path.join(__dirname, 'uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");

// Route middleware
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/message", messageRoute);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}

// Root route
app.get("/", (req, res) => res.send("Hello World!"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));
