const {DataTypes} = require('sequelize');
const sequleize = require('../util/database');

const reportTable= sequleize.define('report',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey: true
    },
    fileUrl:{
        type: DataTypes.STRING
    }
});

module.exports= reportTable;