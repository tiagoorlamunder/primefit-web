document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Login bem-sucedido!');
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Erro no login');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
    }
});
