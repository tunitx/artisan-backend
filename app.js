//? requiring node modules

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 

//? connect to mongo db atlas 
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL , { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

//? requiring User model for authentication
const User = require('./Models/userModel');

//? to verify token validity sent by tushar 
//! for checking on postman purposes: Header - > 
//! Authorization : bearer 'Real_Token_Value'
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization ;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
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
app.post('/register', async (req, res) => {
    console.log(res.body);
    const saltRounds = 10;
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    //? to check if the user has already registered 
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    //? Hashing the password to store in the db securely 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
        name: username,
        email: email,
        password: hashedPassword
    });
    await user.save();

    //? Generating JWT token (to be sent to the client and be saved in browsers local storage)
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User created' });
});

//? User login route 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // ? Send JWT token in response
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login successful', token });
});

//? Protected route for verifying the user's token using verifyToken function
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route' });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is up on port : ' +  process.env.PORT || 3000);
});