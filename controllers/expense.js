const Expense= require('../models/expense');
//const sequelize= require('sequelize');

exports.postExpense= async(req,res,next)=>{
    try {
        const {amount, description, category } = req.body;
        const data = await Expense.create({ amount: amount, description:description, category:category });
        res.status(201).json({ newUserExpense: data });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
 };

 exports.getExpense= async(req,res,next)=>{
    try{
        const expenses= await Expense.findAll();
        res.status(200).json({allExpense: expenses});
      }
      catch(err){
        console.log('Get expenses is failing',JSON.stringify(err));
        res.status(500).json({error:err});
      }
};

exports.deleteExpense= async(req,res,next)=>{
    const id = req.params.id;
    //console.log(id);
    try {
      if(!req.params.id){
        return res.status(400).json({error: 'Id is missing'})
      }
      await Expense.destroy({where: { id: id}});
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
};