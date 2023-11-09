const express= require('express');
const router= express.Router();
const expenseController= require('../controllers/expense');


router.post('/addexpense',expenseController.postExpense);
router.get('/getallexpense',expenseController.getExpense);
router.delete('/deleteexpense/:id',expenseController.deleteExpense);

module.exports= router;