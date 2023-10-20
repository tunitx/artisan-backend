//? requiring node modules

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const ejs = require("ejs");

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
console.log(process.env.CLOUDINARY_CLOUD_NAME);

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

//? connect to mongo db atlas

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

//? requiring User model for authentication

const User = require("./Models/userModel");
const khojoProfile = require("./Models/khojoUserProfile");

//? to verify token validity sent by tushar

//! for checking on postman purposes: Header - >
//! Authorization : bearer 'Real_Token_Value'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

//? for registering new user

const saltRounds = 10;

app.post("/signup", async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  const existingUserName = await User.findOne({ name: username });

  //? to check if the user has already registered

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  if (existingUserName) {
    return res.status(409).json({ message: "Username already exists" });
  }

  //? Hashing the password to store in the db securely

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userWithProfiles = new User({
    name: username,
    email: email,
    password: hashedPassword,
  });
  await userWithProfiles.save();

  //? Generating JWT token (to be sent to the client and be saved in browsers local storage)

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  // res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 10 });
  res.status(201).json({ message: "User created", token, userWithProfiles });
});

//? User login route

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  //? populate the user object with the khojoUserProfiles array
  const userWithProfiles = await User.findById(user._id)
    .populate("khojoUserProfiles")
    .exec();

  // ? Send JWT token in response

  res.json({ message: "Login successful", token, userWithProfiles });
});

//? Protected route for verifying the user's token using verifyToken function

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route" });
});

//! for dummy use only
app.get("/create-userProfile", async (req, res) => {
  res.render("form.ejs");
});

//? setup cloudinary storage

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user-profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
    // transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const parser = multer({ storage });

// todo : /create-userProfile route for creating khojo user profile

app.post(
  "/create-userProfile",
  verifyToken,
  parser.single("pfp"),
  async (req, res) => {
    // console.log(JSON.stringify(req.body));
    console.log(req.body);
    console.log(req.user);
    const pfp = req.file.path;
    console.log(req.file);

    try {
      //? upload profile photo to cloudinary

      const result = await cloudinary.uploader.upload(pfp);
      const {
        name,
        businessName,
        businessAddress,
        businessDetails,
        district,
        instagram,
        facebook,
        twitter
      } = req.body;

      //? create new user profile object

      const userProfile = new khojoProfile({
        pfp: result.secure_url,
        name: name,
        businessName: businessName,
        businessAddress: businessAddress,
        businessDetails: businessDetails,
        socialLinks:{
            'instagram': instagram,
            'facebook': facebook,
            'twitter': twitter
        },
        district: district,
        theme_id: req.body.theme_id,
        User: await User.findOne({ email: req.user.email })._id,
      });

      //? save user profile to database

      await userProfile.save();

      //? push the reference of the new userProfile into the current user's khojoProfiles array

      const user = await User.findOne({ email: req.user.email });
      console.log(userProfile._id);
      user.khojoUserProfiles = user.khojoUserProfiles || []; //? initialize khojoProfile to an empty array if it's undefined
      user.khojoUserProfiles.push(userProfile._id);

      await user.save();

      //? populate the user object with the khojoUserProfiles array

      const userWithProfiles = await User.findById(user._id).populate(
        "khojoUserProfiles"
      );
      console.log(userWithProfiles);
      res
        .status(201)
        .json({ message: "KhojoUserprofile created", userWithProfiles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//Todo : /update-userProfile route for updating user profile

app.put("/update-userProfile/:id", parser.single("pfp"), async (req, res) => {
  //! this id should be the id of the khojo user profile that the user wants to update
  //! can be removed later,  not specified
  const { id } = req.params;
  const {
    name,
    businessName,
    businessAddress,
    businessDetails,
    socialLinks,
    skills,
  } = req.body;
  const pfp = req.file.path;

  try {
    //? upload profile photo to cloudinary

    const result = await cloudinary.uploader.upload(pfp);

    //? find user profile by id

    const userProfile = await khojoProfile.findById(id);

    //? update user profile object
    userProfile.pfp = result.secure_url;
    userProfile.name = name;
    userProfile.businessName = businessName;
    userProfile.businessAddress = businessAddress;
    userProfile.businessDetails = businessDetails;
    userProfile.socialLinks = socialLinks;
    userProfile.skills = skills;

    //? save updated user profile to database

    await userProfile.save();

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//!!: profile photo, name : name of the user, businessName : business name, businessAddress : business address, businessDetails : business details, socialLinks : social links, skills : skills

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is up on port : " + process.env.PORT || 3000);
});
