const Expense= require('../models/expense');
const User= require('../models/user');
const sequelize=require('../util/database');
const AWS = require('aws-sdk');
const UserServices = require('../Services/userservices');
const S3Services = require('../Services/S3services');
const Report= require('../models/reports');

exports.postExpense= async(req,res,next)=>{
        const t = await sequelize.transaction();
        try {
            const amount = req.body.amount;
            const description = req.body.description;
            const category = req.body.category;
            const data = await req.user.createExpense(
                { amount: amount, description: description, category: category },
                { transaction: t }
            );
            const totalExpenses = Number(req.user.totalExpense) + Number(amount);
            await User.update(
                { totalExpense: totalExpenses },
                { where: { id: req.user.id }, transaction: t }
            );
            await t.commit();
            res.status(201).json({ newUserExpense: data });
        } catch (err) {
            await t.rollback();
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }

 };

 exports.getExpense= async(req,res,next)=>{
  //const ITEMS_PER_PAGE = 2;
    try{
        const a = +(req.query.itemPerPage || 1);
        ITEMS_PER_PAGE = a  ;
        const page = req.query.page || 1;
        let totalItems ;
        Expense.count({ where: {userId: req.user.id}})
        .then((total) => {
            totalItems = total;
           // console.log('totalItems is :',totalItems);
            return Expense.findAll({ where: {userId: req.user.id},
                offset: (page-1) * ITEMS_PER_PAGE,
                limit: ITEMS_PER_PAGE            
            })
        })
        .then((expenseDetails) => {
           // console.log('ITEMS_PER_PAGE * page is:',ITEMS_PER_PAGE * page);
            return res.status(200).json({
                allExpense : expenseDetails ,
                isPremiumUser : req.user.isPremiumUser,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                nextPage: +page+1,
                hasPreviousPage:page>1,
                previousPage:+page-1,
                lastPage:Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch((err) => console.log(err));
        // const expenses= await  req.user.getExpenses();           //Expense.findAll({where :{userId: req.user.id}});
        // res.status(200).json({allExpense: expenses});
      }
      catch(err){
        console.log('Get expenses is failing',JSON.stringify(err));
        res.status(500).json({error:err});
      }
}
 

exports.deleteExpense= async(req,res,next)=>{
  const t=await sequelize.transaction()
  try{
      console.log(req.params.id)
      if(!req.params.id){
          throw new Error('id is missing')  
      }
      const id=req.params.id
      const response= await Expense.findOne({
          where:{id:id},
          transaction:t
        })
      const result=await Expense.destroy({where:{id:id,userId:req.user.id}},{transaction:t})
      console.log(result)
      const totalExpenses=Number(req.user.totalExpense)-Number(response.amount)
      await User.update({
        totalExpense:totalExpenses
      },{
          where:{id:req.user.id},
          transaction:t})
    await t.commit()
    res.status(200).json(result)    
  }catch(err){
      await t.rollback()
      res.status(500).json({error:err})
  }
};

exports.downloadReport= async (req,res,next)=>{
  try {
    const expenses = await UserServices.getExpenses(req);  
    // console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses); 
    const userid = req.user.id;

    const filename = `Expense${userid}/${new Date()}.txt`;
    const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
    //console.log(fileUrl);
    const response = await Report.create({fileUrl, userId:req.user.id });
    res.status(201).json({ fileUrl, success: true});
  } catch(err) {
    console.log(err);
    res.status(500).json({ fileUrl:'', success: false, err: err});  
  }  
};

exports.downloadHistory= async (req,res)=>{
  try{
    const download= await Report.findAll({where:{userId:req.user.id}})
    res.status(200).json({success:true, allFileUrl:download})
}catch(err){
  console.log(err)
  return res.status(500).json({fileUrl:'', success:false, message:'Failed', err:err})
  }
  
  }