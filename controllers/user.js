const User = require('../models/user');

exports.postSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!email) {
            throw new Error('Please enter email');
        }

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(409).json({ err: 'User already exists' });
        }

        const user = await User.create({
            username: username,
            email: email,
            password: password
        });

        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
