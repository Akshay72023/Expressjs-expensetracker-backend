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

exports.postLogin= async(req,res,next) => {
    try{
        const {email,password} = req.body;
        const existingUser= await User.findOne({where : {email: email}});
        if(!existingUser){
            return res.status(404).json({err : "User does'nt exist"})
        }
        const isPasswordCorrect = (existingUser.password === password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ err: "Incorrect password" });
        }
        
         return res.status(201).json({ message: 'Login successful' }); 
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
};
