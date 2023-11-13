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
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
        
    window.addEventListener('DOMContentLoaded' ,async ()=>{  
        const token= localStorage.getItem('token');
        const decodeToken= parseJwt(token);
        //console.log(decodeToken);
        try {
            const response= await axios.get('http://localhost:3000/expense/getallexpense', {headers:{'Authorization':token}});
            // console.log(response);
            for (var i = 0; i < response.data.allExpense.length; i++) {
                showUserDetails(response.data.allExpense[i]);
            }
            const ispremiumuser=decodeToken.isPremiumUser
            if(ispremiumuser){
                showPremiumUser();
                showLeaderboard();
            }
            } 
            catch (err) {
                console.log(err);
            }
        });

        function showPremiumUser() {
                const rzpButton = document.getElementById('rzp-button1');
                const premiumMessageWrapper = document.getElementById('Premium user message');
            
                    rzpButton.style.display = 'none';
                    premiumMessageWrapper.style.backgroundColor = 'rgb(147 175 76);'; 
                    premiumMessageWrapper.style.color = '#954d19'; 
                    premiumMessageWrapper.style.padding = '10px'; 
                    premiumMessageWrapper.style.borderRadius = '5px';
                    premiumMessageWrapper.style.width= '65%';

                    const premiumMessage = document.createElement('span');
                    premiumMessage.textContent = 'You are a premium user';
            
                    premiumMessageWrapper.appendChild(premiumMessage);
             }
            
        
        
        
        
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
                //console.log(response);
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
                        const result=await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                            order_id: options.order_id,
                            payment_id: response.razorpay_payment_id,
                        }, { headers: { "Authorization": token } });
                         console.log(result.data.token)   
                        alert('You are a Premium User Now');
                        const rzpButton = document.getElementById('rzp-button1');
                        const premiumMessageWrapper = document.getElementById('Premium user message');
                        rzpButton.style.display = 'none';
                        premiumMessageWrapper.style.backgroundColor = 'rgb(147 175 76);'; 
                        premiumMessageWrapper.style.color = '#954d19'; 
                        premiumMessageWrapper.style.padding = '10px'; 
                        premiumMessageWrapper.style.borderRadius = '5px';
                        premiumMessageWrapper.style.width= '65%';
                        const premiumMessage = document.createElement('span');
                        premiumMessage.textContent = 'You are a premium user';
                        premiumMessageWrapper.appendChild(premiumMessage);
                        localStorage.setItem('token', result.data.token);
                        showLeaderboard();
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
        
async function showLeaderboard(){
    const premiumMessageWrapper = document.getElementById('Premium user message');
    const divElement = document.createElement('div');
    premiumMessageWrapper.appendChild(divElement);
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.className='btn btn-primary'
    inputElement.onclick = async() => {
            const token = localStorage.getItem('token')
            const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard', { headers: {"Authorization" : token} })

            var leaderboardElem = document.getElementById('leaderboard')
            leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
            userLeaderBoardArray.data.forEach((userDetails) => {
                leaderboardElem.innerHTML += `<li>Name - ${userDetails.username} , Totalexpense - ${userDetails.totalExpense || 0} </li>`
            })
        }

        document.getElementById("Premium user message").appendChild(inputElement);
}