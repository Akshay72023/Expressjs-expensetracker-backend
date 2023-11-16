const Razorpay = require('razorpay');
const Order = require('../models/order');
const userController= require('./user');
const jwt=require('jsonwebtoken');
require("dotenv").config();

const purchasepremium=async(req,res,next)=>{
    try{
        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500
        rzp.orders.create({amount,currency:'INR'},(err,order)=>{
            
            if(err){
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({orderId:order.id,status:'PENDING'}).then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            }).catch((err)=>{
                throw new Error(err)

            })
        })
    }catch(err){
        res.status(403).json({message:'something went wrong',error:err})
    }
};

function generateAccessToken(id,username,isPremiumUser){
    return jwt.sign({userId :id , username:username,isPremiumUser},process.env.TOKEN_SECRET);
}

const updatetransactionstatus = async (req, res) => {
    try {
        const userId= req.user.id;
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderId: order_id } });
        console.log(payment_id);
            const promise1 = order.update({ paymentId: payment_id, status: 'SUCCESSFUL' });
            const promise2 = req.user.update({ isPremiumUser: true });

            Promise.all([promise1, promise2])
                .then(() => {
                    return res.status(202).json({ success: true, message: 'Transaction Successful',token:generateAccessToken(userId,undefined ,true)});
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).json({ success: false, message: 'Error updating transaction status' });
                });
        
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });
    }
};

const updatetransactionstatusfail = async (req,res) => {
    try {
        const { order_id } = req.body;
        const order = await Order.findOne({ where: { orderId: order_id } });
        const promise1 = order.update({ status: 'FAILED' });
        const promise2 = req.user.update({ isPremiumUser: false });

        Promise.all([promise1, promise2])
                .then(() => {
                    return res.status(202).json({ success: true, message: 'Transaction Failed' });
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).json({ success: false, message: 'Error updating transaction status' });
                });
        
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });
    }
};

module.exports = {
    purchasepremium,
    updatetransactionstatus,
    updatetransactionstatusfail
};


