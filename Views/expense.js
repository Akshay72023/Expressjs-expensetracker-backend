const myForm = document.querySelector('#my-form');
myForm.addEventListener('submit', onSubmit);
const token= localStorage.getItem('token');
const pagination= document.getElementById('pagination-container');
const parentEle = document.querySelector('.items');

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
        const ispremiumuser=decodeToken.isPremiumUser;
            if(ispremiumuser){
                showPremiumUser();
                showNewFeatures();
            }
        const page=1;
        //console.log(decodeToken);
        try {
            const token= localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/expense/getallexpense?page=${page}`, { headers: {"Authorization" : token}});
            // console.log(response);
            showPagination(response.data);
            if(response.status===200){
            for (var i = 0; i < response.data.allExpense.length; i++) {
                showUserDetails(response.data.allExpense[i]);
            }
        }
            
            } 
            catch (err) {
                console.log(err);
            }
        });

        function showPagination({
            currentPage,
            hasNextPage,
            nextPage,
            hasPreviousPage,
            previousPage,
            lastPage,
          }) {
            if(hasPreviousPage){
              const btn2 = document.createElement('button')
              btn2.innerHTML = previousPage
              btn2.addEventListener('click', () => getExpenses(previousPage))
              pagination.appendChild(btn2)
            }
          
            const btn1 = document.createElement('button')
            btn1.innerHTML = `<h3>${currentPage}</h3>`
            btn1.addEventListener('click', () => getExpenses(currentPage))
            pagination.appendChild(btn1)
          
           if(hasNextPage) { 
              const btn3 = document.createElement('button')
              btn3.innerHTML = nextPage
              btn3.addEventListener('click', () => getExpenses(nextPage))
              pagination.appendChild(btn3)
           }
          }


      function getExpenses(page) {
        const token = localStorage.getItem('token');
        axios
          .get(`http://localhost:3000/expense/getallexpense?page=${page}`, { headers: { "Authorization": token } })
          .then((response) => {
            console.log(response.data);
            pagination.innerHTML = '';
            showPagination(response.data);
            parentEle.innerHTML = '';
              if (response.status === 200) {
                for (var i = 0; i < response.data.allExpense.length; i++) {
                  showUserDetails(response.data.allExpense[i]);
                } 
            }
          })
          .catch((err) => console.log(err));
      }
      
        
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
            const childEle = `<li id="${expense.id}">${expense.amount}-${expense.description}-${expense.category}
                <button onclick="deleteExpense('${expense.id}')">Delete</button><br><br>`;
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
            const token= localStorage.getItem('token');
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
                        premiumMessageWrapper.textContent = 'You are a premium user';
                        localStorage.setItem('token', result.data.token);
                        showNewFeatures()
                            
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
        
async function showNewFeatures(){
    const premium = document.getElementById('premium');
    const inputElement = '<button class="btn btn-primary"  onclick=showPremiumFeatures()>Show Leaderboard</button><br>';
    const downloadElement='<button class="btn btn-primary" onclick=download()>Download File</button>'
    const newElement='<button class="btn btn-primary" onclick=downloadhistory()>Recent downloads</button>'
    premium.innerHTML+= inputElement;
    premium.innerHTML+=downloadElement;
    premium.innerHTML+=newElement;
}


async function showPremiumFeatures(){
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/premium/showleaderboard`, { headers: {"Authorization" : token}});
    //console.log(response);
    document.getElementById('leaderboard').innerHTML="";
    document.getElementById('leaderboard').innerHTML+=`<h1> Leaderboard <h1>`;
  
    for(var i=0;i<response.data.length;i++){
        console.log(response.data[i].username,response.data[i].totalExpense);
        showLeaderBoard(response.data[i].username,response.data[i].totalExpense);
    }
  }


  
function showLeaderBoard(username,totalExpense){
    const parentNode=document.getElementById('leaderboard');
    const children=`<li id="${username}"> Name : ${username} , Totoalexpense : ${totalExpense} </li>`;
    parentNode.innerHTML=parentNode.innerHTML+children;
}

async function download(){
    try{
        const token = localStorage.getItem('token');
        const response= await axios.get('http://localhost:3000/expense/download',{ headers: {"Authorization" : token} });
        if(response.status===201){
            var a = document.createElement("a");
            a.href=response.data.fileUrl;
            a.download="myexpense.csv";
            a.click();
            const downloadmessage = document.getElementById('downloadmessage');
            downloadmessage.innerHTML += '<h2>File downloaded Successfuly</h2>'
        }
    }
    catch(err){
        console.log(err);
    }
};


async function downloadhistory(){
    try{
     const token=localStorage.getItem('token')
     const response= await axios.get('http://localhost:3000/expense/downloadhistory', {headers: {'Authorization': token}})
     const parentElement = document.getElementById('reportlist');
     parentElement.innerHTML='<h1>Download History</h1>'
     response.data.allFileUrl.forEach((userDownloadReport)=>{
     parentElement.innerHTML+=`<li>url:<a href =${userDownloadReport.fileUrl}> Report, Click here download again</a> <br> Downloaded at ${userDownloadReport.createdAt}<br></li>`
      })
    }
    catch(err){
        console.log(err);
    }
};