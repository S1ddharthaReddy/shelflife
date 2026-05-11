
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


const generateToken = (userId) => {
    return jwt.sign({ id: userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            token: generateToken(user._id),
            user
        })
    }

    catch(error) {
        res.status(500).json({message: error.message})
    }

}


const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({message: "Incorrect creds"})
        }

        res.json({
            token: generateToken(user._id),
            user
        })
    }
    catch(error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = { registerUser, loginUser }