const express = require('express');
const sequelize = require('./util/user');
const cors = require('cors');
const signupRoutes = require('./routes/user');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/user', signupRoutes);

sequelize
    .sync()
    //.sync({force:true})
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }).catch(err => {
        console.log('Error connecting to the database:', err);
    });
