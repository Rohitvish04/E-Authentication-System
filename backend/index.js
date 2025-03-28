const express = require('express');
const qrcode = require('qrcode');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cors({
    origin: 'http://localhost:5173', // or your React app's URL
    credentials: true
  }));
// app.use(cors());

 

// Replace with your actual connection string
const mongoURI = 'mongodb://localhost:27017/your_database';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Rate Limiting 
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 OTP requests per windowMs
  message: 'Too many OTP requests, please try again later'
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate QR code and secret for new user
app.post('/register', async (req, res) => {
    const { email } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Generate secret key
        const secret = speakeasy.generateSecret({
            length: 20, // 160-bit secret
            name: `rohitvvishwakarma400gmail.com:${email}`, // Shows in authenticator apps
            issuer: 'E-Auth-App' // Important for some authenticators
          });
        
        const otpauthUrl = secret.otpauth_url; // This already includes proper formatting
        
       // Generate QR code
        const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
        // Save user to MongoDB
        const user = new User({
            email,
            secret: secret.base32
        });
        await user.save();
        
        res.json({
            qrCodeUrl,
            secret: secret.base32
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/send-otp', otpLimiter,async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const token = speakeasy.totp({
            secret: user.secret,
            encoding: 'base32',
            step: 30 // Ensure this matches your verification
        });

        console.log(`[DEBUG] Generated OTP for ${email}: ${token}`); // Add this line

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your One-Time Password',
            text: `Your OTP is: ${token}. It expires in 30 seconds.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});
app.post('/verify', async (req, res) => {
    const { email, token } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token: token.toString(), // Ensure string comparison
            window: 2, // Check current + 2 previous intervals
            step: 30 // Must match generation step
        });

        console.log(`[DEBUG] Verifying OTP for ${email}: ${token} against secret ${user.secret}`);

        if (verified) {
            user.verified = true;
            await user.save();

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
              );
            res.json({ message: 'Authentication successful',token });
        } else {
            // Log what the current valid token should be
            const currentToken = speakeasy.totp({
                secret: user.secret,
                encoding: 'base32',
                step: 30
            });
            console.log(`[DEBUG] Current valid token should be: ${currentToken}`);
            
            res.status(401).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});
// Get user status
app.get('/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ email: user.email, verified: user.verified });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

app.get('/hello',(req, res) =>{
    res.json('hhsdflk')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});