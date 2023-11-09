const loginBtn= document.getElementById('login-btn');
loginBtn.addEventListener('click',
    async function(e){
        e.preventDefault();
        const email= document.getElementById('email').value;
        const password= document.getElementById('password').value;

        const obj= {
            email,
            password
        }
        try{
            const response= await axios.post('http://localhost:3000/user/login',obj)
                if(response.status === 201){
                    alert(response.data.message);
                }
        }
        catch(error){
            if(error.response.status=== 404){
                alert(error.response.data.err);
            }
            else if(error.response.status===401){
                alert(error.response.data.err);
            }
            console.log(error);
    };

});