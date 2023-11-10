const myForm = document.querySelector('#my-form');
myForm.addEventListener('submit', onSubmit);

    async function onSubmit(e){
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        const obj={
            amount,
            description,
            category
        }
        const token= localStorage.getItem('token');
        try{
            const response= await axios.post('http://localhost:3000/expense/addexpense',obj,{headers:{'Authorization':token}});
            showUserDetails(response.data.newUserExpense);
            } 
        catch (err) {
            console.error(err);
            document.body.innerHTML += "<h4 style='text-align: center;'> Something went wrong </h4>";
        }
    }

        
    window.addEventListener('DOMContentLoaded' ,async ()=>{  
        const token= localStorage.getItem('token');
        console.log(token);
        try {
            const response= await axios.get('http://localhost:3000/expense/getallexpense', {headers:{'Authorization':token}});
            // console.log(response);
            for (var i = 0; i < response.data.allExpense.length; i++) {
                showUserDetails(response.data.allExpense[i]);
            }
            } 
            catch (err) {
                console.log(err);
            }
        });
        
        
        function showUserDetails(expense) {
            const parentEle = document.querySelector('.items');
            const childEle = `<li id="${expense.id}">${expense.amount}-${expense.description}-${expense.category}
                <button onclick="deleteExpense('${expense.id}')">Delete</button>`;
            parentEle.innerHTML += childEle;
        }


        async function deleteExpense(id){
            const token= localStorage.getItem('token');
            try{
                const response= await axios.delete(`http://localhost:3000/expense/deleteexpense/${id}`,{headers:{'Authorization':token}});
                removeUserFromScreen(id);
            }
            catch(err){
                console.log(err);
            }
           
        } 

        function removeUserFromScreen(id){
            const parentNode= document.querySelector('.items');
            const childNodetobeDeleted= document.getElementById(id);
            parentNode.removeChild(childNodetobeDeleted);
        }



        document.getElementById('rzp-button1').onclick = async function (e) {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.post('http://localhost:3000/purchase/premiummembership', {}, { headers: { 'Authorization': token } });
            console.log(response);
        
            var options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function (response) {
                        await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                            order_id: options.order_id,
                            payment_id: response.razorpay_payment_id,
                        }, { headers: { "Authorization": token } });
        
                        alert('You are a Premium User Now');
                }
            };
        
            const rzp1 = new Razorpay(options);
            rzp1.open();
            e.preventDefault();
            rzp1.on('payment.failed', async function (response) {
              console.log(response);
              await axios.post('http://localhost:3000/purchase/updatetransactionstatusFail', {
                        order_id: options.order_id,
                    }, { headers: {"Authorization" : token} })
              alert('Transaction Failed');
            })
        };
        