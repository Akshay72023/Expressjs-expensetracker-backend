const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

exports.postSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!email) {
            throw new Error('Please enter email');
        }
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ err: 'User already exists' });
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            const user = await User.create({
                username: username, email: email, password: hash
            });
            return res.status(201).json({ message: 'User created successfully' });
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

function generateAccessToken(id,username,isPremiumUser){
    return jwt.sign({userId :id , username:username,isPremiumUser},'secretekey');
}

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ where: { email: email } });
        if (!existingUser) {
            return res.status(404).json({ err: "User doesn't exist" });
        }
        bcrypt.compare(password, existingUser.password, (err, result) => {
            if (err) {
                throw err;
            }
            if (result) {
                return res.status(201).json({success:true,message: 'Login successful' ,token: generateAccessToken(existingUser.id,existingUser.username,existingUser.isPremiumUser)});
            } else {
                return res.status(401).json({success:false, err: "Incorrect password" });
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
