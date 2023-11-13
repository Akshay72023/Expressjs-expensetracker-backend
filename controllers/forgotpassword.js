const bcrypt = require('bcrypt');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

exports.forgotpassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      console.log('forgot user>>>', user.email);
      if (user.email) {
        const id = uuidv4();
        const createForgotpassword = await Forgotpassword.create({
          id: id,
          active: true,
          userId: user.id,
        });
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
          },
        });
        const mailOptions = {
          from: process.env.EMAIL_USER, 
          to: email,
          subject: 'Reset Password',
          text: 'Click the link below to reset your password:',
          html: `<p>Click the link below to reset your password:</p><a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully.', uuid: id });
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message, message: false });
    }
  };

  exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                        <body>
                            <form action="http://localhost:3000/password/updatepassword/${id}" id="form" method="get">
                            <label for="password">Enter New Password</label><br>
                            <input type="password" name="password" id="password" required/><br><br>
                            <button type="submit" >Reset password</button><br><br>
                            </form>
                            <script>
                            document.getElementById("form").addEventListener('submit', formSubmit);
                            async function formSubmit(e) {
                                e.preventDefault();
                                console.log('called');
                            }
                            </script>
 
                            </body>
                            </html>`)
            res.end()

        }
    })
}
  


exports.updatepassword = async (req, res) => {
    try {
        console.log(req.params);
        const { password } = req.query;
        const id = req.params.id;
        const resetpasswordrequest = await Forgotpassword.findOne({ where: { id } });
        if (resetpasswordrequest) {
            const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });
            console.log('userDetails', user);
            if (user) {
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hash = await bcrypt.hash(password, salt);
                await user.update({ password: hash });
                res.status(201).json('Successfully update the new password');
            } else {
                return res.status(404).json({ error: 'No user exists', success: false });
            }
        } 
        else {
            return res.status(404).json({ error: 'Reset password request not found', success: false });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message, success: false });
    }
};
