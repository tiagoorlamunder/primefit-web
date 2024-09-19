// Adiciona um ouvinte de evento para o formulário de registro quando ele é submetido
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    // Impede o comportamento padrão de envio do formulário
    event.preventDefault();

    // Obtém os valores dos campos de entrada do formulário
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Verifica se as senhas fornecidas coincidem
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.'); // Exibe um alerta se as senhas não coincidirem
        return; // Interrompe a execução da função
    }

    try {
        // Faz uma requisição POST para o endpoint de registro com as informações fornecidas
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Define o tipo de conteúdo como JSON
            body: JSON.stringify({ username, email, phone, password }) // Converte as informações para JSON e inclui no corpo da requisição
        });

        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            alert('Cadastro realizado com sucesso!'); // Informa ao usuário que o registro foi bem-sucedido
            // Redireciona o usuário para a página de login
            window.location.href = 'login.html';
        } else {
            // Obtém e exibe a mensagem de erro retornada pelo servidor
            const errorText = await response.text();
            alert(`Erro: ${errorText}`);
        }
    } catch (error) {
        // Captura e exibe um erro se a requisição falhar
        alert('Erro ao conectar com o servidor.');
    }
});
