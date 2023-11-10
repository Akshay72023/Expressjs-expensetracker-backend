const{DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const orderModel= sequelize.define('order',{
    id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    paymentId: DataTypes.STRING,
    orderId: DataTypes.STRING,
    status: DataTypes.STRING
});

module.exports= orderModel;