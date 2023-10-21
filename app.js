//? requiring node modules

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const ejs = require("ejs");
const db = require("./db");
const cloudinary = require("cloudinary").v2;

//? configure cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// ? requiring routes

const signinRouter = require("./routes/signin");
const signupRouter = require("./routes/signup");
const userProfileRouter = require("./routes/create-userProfile");
const khojoUserProfileRouter = require("./routes/getAllKhojoProfiles");
const templateByID = require("./routes/getTemplateByID");
const getAllTemplates = require("./routes/getAllTemplates");

//? using the routes
app.use("/auth", signinRouter);
app.use("/auth", signupRouter);
app.use(userProfileRouter);
app.use(khojoUserProfileRouter);
app.use(templateByID);
app.use(getAllTemplates);

//? for dummy use only 
app.get('/create-userProfile', async (req, res) => {
  res.render('form.ejs');
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is up on port : " + process.env.PORT || 3000);
});
