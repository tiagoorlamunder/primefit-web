document.getElementById('loginForm').addEventListener('submit', async (event) => {
    // Impede o comportamento padrão de envio do formulário
    event.preventDefault();

    // Obtém os valores dos campos de entrada do formulário
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Faz uma requisição POST para o endpoint de login com as credenciais fornecidas
        const response = await fetch('https://primefit-api.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Define o tipo de conteúdo como JSON
            body: JSON.stringify({ username, password }) // Converte as credenciais para JSON e inclui no corpo da requisição
        });
        
        // Converte a resposta da requisição para JSON
        const data = await response.json();
        
        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Login bem-sucedido!',
                text: 'Você foi redirecionado para a página principal.',
            });
            // Armazena o token JWT e o nome de usuário no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            // Redireciona o usuário para a página principal
            window.location.href = 'index.html';
        } else {
            // Exibe uma mensagem de erro, se houver
            Swal.fire({
                icon: 'error',
                title: 'Erro no login',
                text: data.message || 'Verifique suas credenciais.',
            });
        }
    } catch (error) {
        // Captura e exibe um erro se a requisição falhar
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao conectar com o servidor.',
        });
    }
});