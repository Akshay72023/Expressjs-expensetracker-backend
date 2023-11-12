const User= require('../models/user');
const Expense=require('../models/expense');
const sequelize= require('../util/database');
//const sequelize= require('sequleize')



const getLeaderboard= async(req,res)=>{
    try{
        const userLeaderBoardDetails= await User.findAll({
            // attributes:['id','username',[sequelize.fn('sum', sequelize.col('expenses.amount')),'totalExpense']],
            // include:[{
            //     model: Expense,
            //     attributes:[]
            // }],
            // group:['user.id'],
            order: [[sequelize.literal('totalExpense'), 'DESC']]
        });
        console.log(userLeaderBoardDetails);
        res.status(201).json(userLeaderBoardDetails);

        // const userAgrregateExpense=await Expense.findAll({
        //     attributes:['userId',[sequelize.fn('sum', sequelize.col('expense.amount')),'total_cost']],
        //     group: ['userId']
        // });
        //console.log(userAgrregateExpense);
    }
    catch (err){
        res.status(500).json({error : err});
    }
}




// const getLeaderboard= async(req,res)=>{
//     try{
    //         const users= await User.findAll();
    //         const expenses=await Expense.findAll();
//         //console.log(users);
//         //console.log(expenses);
//         const userAgrregateExpense = {};
//         expenses.forEach((expense)=>{
//                 if(userAgrregateExpense[expense.userId]){
//                     userAgrregateExpense[expense.userId]= userAgrregateExpense[expense.userId]+expense.amount;
//                 }
//                 else{
//                     userAgrregateExpense[expense.userId]=expense.amount;
//                 }
//         })
//         const userLeaderBoardDetails= [];
//         users.forEach((user)=>{
//             userLeaderBoardDetails.push({username: user.username, totalExpense:userAgrregateExpense[user.id] || 0 })
//         })
//         userLeaderBoardDetails.sort((a,b)=> b.totalExpense-a.totalExpense);
//         //console.log(userLeaderBoardDetails);
//         res.status(200).json(userLeaderBoardDetails)
//     }
//     catch(error){
//         res.status(500).json({err:error});
//     }

    
// }










module.exports={
    getLeaderboard
};