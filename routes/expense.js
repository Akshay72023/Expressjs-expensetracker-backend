const express= require('express');
const router= express.Router();
const expenseController= require('../controllers/expense');
const authentication = require('../middleware/authentication');


router.post('/addexpense',authentication.authenticate,expenseController.postExpense);
router.get('/getallexpense',authentication.authenticate,expenseController.getExpense);
router.delete('/deleteexpense/:id',authentication.authenticate,expenseController.deleteExpense);

module.exports= router;