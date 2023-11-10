const Expense= require('../models/expense');
//const sequelize= require('sequelize');

exports.postExpense= async(req,res,next)=>{
    try {
        const amount=req.body.amount
        const description=req.body.description
        const category=req.body.category
        const data = await  req.user.createExpense({ amount: amount, description:description, category:category});
        //Expense.create({ amount: amount, description:description, category:category,userId:req.user.id });
        res.status(201).json({ newUserExpense: data });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
 };

 exports.getExpense= async(req,res,next)=>{
    try{
        const expenses= await  req.user.getExpenses();           //Expense.findAll({where :{userId: req.user.id}});
        res.status(200).json({allExpense: expenses});
      }
      catch(err){
        console.log('Get expenses is failing',JSON.stringify(err));
        res.status(500).json({error:err});
      }
};

exports.deleteExpense= async(req,res,next)=>{
    const id = req.params.id;
    console.log(id);
    try {
      if(!req.params.id){
        return res.status(400).json({error: 'Id is missing'})
      }
      await Expense.destroy({where: { id: id , userId: req.user.id}});
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
};