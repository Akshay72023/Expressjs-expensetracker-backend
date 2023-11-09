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
        try{
            const response= await axios.post('http://localhost:3000/expense/addexpense',obj)
            showUserDetails(response.data.newUserExpense);
            } 
        catch (err) {
            console.error(err);
            document.body.innerHTML += "<h4 style='text-align: center;'> Something went wrong </h4>";
        }
    }

        
    window.addEventListener('DOMContentLoaded' ,async ()=>{  
        try {
            const response= await axios.get('http://localhost:3000/expense/getallexpense');
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
            try{
                const response= await axios.delete(`http://localhost:3000/expense/deleteexpense/${id}`);
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
