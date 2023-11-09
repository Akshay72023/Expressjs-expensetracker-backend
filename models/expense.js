const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const expenseModel= sequelize.define('expense',{
    id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey: true
    },
    amount:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    description:{
        type: DataTypes.STRING,
        allowNull:false
    },
    category:{
        type: DataTypes.STRING,
        allowNull:false
    }
});

module.exports= expenseModel;