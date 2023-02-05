const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS to allow requests from any origin
app.use(cors());

// Parse form data in request body
app.use(express.urlencoded({ extended: true }));

//Set view engine
app.set("view engine", "ejs");

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for service request data
const serviceRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
  notes: { type: String },
});

// Create a model based on the schema
const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

// Handle form submissions to /servicerequest endpoint
app.post('/servicerequest', async (req, res) => {
  try {
    // Create a new service request object
    const request = new ServiceRequest({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      date: req.body.date,
      time: req.body.time,
      service: req.body.service,
      notes: req.body.notes,
    });

    console.log(request);

    // Save the service request to the database
    await request.save();

    // Redirect the user back to the homepage
    res.redirect('/');
  } catch (error) {
    console.error(error);
    // Send a 500 error response if an error occurs
    res.status(500).send('An error occurred, please try again later.');
  }
});

app.get("/admin", async (req, res) => {
    // Fetch all form data from the database
    const serviceRequests = await ServiceRequest.find({}).sort({ date: 1, time: 1 });
  
    // Render the admin.ejs template and pass in the form data
    res.render("admin", {serviceRequests });
  });

// Serve static files from the public folder
app.use(express.static('public'));

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});