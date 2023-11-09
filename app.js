const express = require('express');
const sequelize = require('./util/database');
const cors = require('cors');
const signupRoutes = require('./routes/user');
const expenseRoutes= require('./routes/expense');
const bodyParser = require('body-parser');

const app = express();

const User= require('./models/user');
const Expense= require('./models/expense');

app.use(bodyParser.json());
app.use(cors());

app.use('/user', signupRoutes);
app.use('/expense',expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

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
