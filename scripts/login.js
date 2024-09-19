// Adiciona um ouvinte de evento para o formulário de login quando ele é submetido
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    // Impede o comportamento padrão de envio do formulário
    event.preventDefault();

    // Obtém os valores dos campos de entrada do formulário
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Faz uma requisição POST para o endpoint de login com as credenciais fornecidas
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Define o tipo de conteúdo como JSON
            body: JSON.stringify({ username, password }) // Converte as credenciais para JSON e inclui no corpo da requisição
        });
        
        // Converte a resposta da requisição para JSON
        const data = await response.json();
        
        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            alert('Login bem-sucedido!'); // Informa ao usuário que o login foi bem-sucedido
            // Armazena o token JWT e o nome de usuário no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            // Redireciona o usuário para a página principal
            window.location.href = 'index.html';
        } else {
            // Exibe uma mensagem de erro, se houver
            alert(data.message || 'Erro no login');
        }
    } catch (error) {
        // Captura e exibe um erro se a requisição falhar
        alert('Erro ao conectar com o servidor.');
    }
});
