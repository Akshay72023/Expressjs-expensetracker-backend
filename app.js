const express = require('express');
const sequelize = require('./util/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet= require('helmet');
const path=require('path');
const morgan= require('morgan');
const fs=require('fs');

dotenv.config();
const app = express();

const accesslogstream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined',{stream:accesslogstream}));

const signupRoutes = require('./routes/user');
const expenseRoutes= require('./routes/expense');
const purchaseRoutes= require('./routes/purchase');
const premiumRoutes= require('./routes/premiumfeature');
const passwordRoutes=require('./routes/forgotpassword');

app.use('/user', signupRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);


const User= require('./models/user');
const Expense= require('./models/expense');
const Order= require('./models/order');
const Forgotpassword=require('./models/forgotpassword');
const Report= require('./models/reports');


User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);
User.hasMany(Report);
Report.belongsTo(User);


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
