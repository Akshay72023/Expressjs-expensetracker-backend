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

        const response= await axios.post('http://localhost:3000/user/login',obj)
        .then(response=>{
                if(response.status === 201){
                    alert('Login successful');
                }
        })
        .catch(err=>{
            if(err.response.status=== 404){
                alert("User does'nt exists please sinup")
            }
            else if(err.response.status===401){
                alert("Password Incorrect")
            }
            console.log(err);
        })
    });