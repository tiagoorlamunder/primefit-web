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
        return Swal.fire({
            title: 'Atenção!',
            text: 'As senhas não coincidem.',
            icon: 'warning', // Ícone de aviso
            confirmButtonText: 'OK' // Botão de confirmação
        });
        
    }

    try {
        // Faz uma requisição POST para o endpoint de registro com as informações fornecidas
        const response = await fetch('https://primefit-api.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Define o tipo de conteúdo como JSON
            body: JSON.stringify({ username, email, phone, password }) // Converte as informações para JSON e inclui no corpo da requisição
        });
    
        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            // Exibe o SweetAlert de sucesso
            await Swal.fire({
                title: 'Atenção!',
                text: 'Cadastro realizado com sucesso!',
                icon: 'success', // Ícone de sucesso
                confirmButtonText: 'OK' // Botão de confirmação
            });
            // Redireciona o usuário para a página de login após o clique no botão "OK"
            window.location.href = 'login.html';
        } else {
            // Obtém e exibe a mensagem de erro retornada pelo servidor
            const errorText = await response.text();
    
            // Exibe o SweetAlert de erro
            await Swal.fire({
                title: 'Atenção!',
                text: `Erro: ${errorText}`,
                icon: 'error', // Ícone de erro
                confirmButtonText: 'OK' // Botão de confirmação
            });
        }
    } catch (error) {
        // Captura e exibe um erro se a requisição falhar
        console.log('Erro ao conectar com o servidor', error);
    
        // Exibe o SweetAlert de falha na conexão
        await Swal.fire({
            title: 'Erro ao conectar com o servidor.',
            text: `Erro: ${error.message}`, // Mostra a mensagem de erro
            icon: 'error', // Ícone de erro
            confirmButtonText: 'OK' // Botão de confirmação
        });
    }
});    
