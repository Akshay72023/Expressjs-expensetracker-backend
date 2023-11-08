const signupButton = document.getElementById('signup-btn');
signupButton.addEventListener('click', async function(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        username: username,
        email: email,
        password: password
    };

    try {
        const response = await axios.post('http://localhost:3000/user/signup', user);
        if (response.status === 201) {
            alert('Signup successful');
            window.location.href = './login.html';
        }
    } catch (error) {
        if (error.response.status === 409 && error.response.data.err === 'User already exists') {
            alert('User already exists');
        } else {
            console.error(error);
            document.body.innerHTML += `<div >Error: ${error.message} <div>`;
        }
    }
});
