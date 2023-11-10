const express = require('express');
const sequelize = require('./util/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const signupRoutes = require('./routes/user');
const expenseRoutes= require('./routes/expense');
const purchaseRoutes= require('./routes/purchase');

const app = express();

const User= require('./models/user');
const Expense= require('./models/expense');
const Order= require('./models/order');

app.use(bodyParser.json());
app.use(cors());

app.use('/user', signupRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

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
