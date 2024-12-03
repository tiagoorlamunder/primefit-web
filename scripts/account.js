// Adiciona um ouvinte de evento para quando o conteúdo do DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Obtém o token JWT armazenado no localStorage
    const token = localStorage.getItem('token');

    // Verifica se o token existe; se não, redireciona para a página de login
    if (!token) {
        Swal.fire({
            title: 'Atenção!',
            text: 'Você precisa estar logado para acessar esta página.',
            icon: 'warning', // Ícone de aviso
            confirmButtonText: 'OK' // Botão de confirmação
        });

        window.location.href = 'login.html';
        return;
    }

    try {
        // Decodifica o token JWT para obter o ID do usuário
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;

        // Verifica se o ID do usuário está presente no token; se não, redireciona para a página de login
        if (!userId) {

            Swal.fire({
                title: 'Atenção!',
                text: 'ID do usuário não encontrado no token JWT.',
                icon: 'warning', // Ícone de aviso
                confirmButtonText: 'OK' // Botão de confirmação
            });

            window.location.href = 'login.html';
            return;
        }

        // Faz uma requisição GET para obter informações do usuário com base no ID do usuário
        fetch(`https://primefit-api.onrender.com/api/user/info?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Inclui o token JWT no cabeçalho de autorização
            }
        })
            .then(response => {
                // Verifica se a resposta HTTP foi bem-sucedida; caso contrário, lança um erro
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json(); // Converte a resposta em JSON
            })
            .then(data => {
                // Atualiza o conteúdo da página com as informações do usuário obtidas
                document.getElementById('userName').textContent = data.name || 'Nome não disponível';
                document.getElementById('userEmail').textContent = data.email || 'E-mail não disponível';
                document.getElementById('userPhone').textContent = data.phone || 'Telefone não disponível';

                // Atualiza o plano do usuário, se disponível
                if (data.planName && data.planDescription) {
                    document.getElementById('userPlan').textContent = data.planName;
                    document.getElementById('planDescription').textContent = data.planDescription;
                } else {
                    document.getElementById('userPlan').textContent = 'Sem plano';
                    document.getElementById('planDescription').textContent = 'Descrição não disponível';
                }
            })
            .catch(error => {
                // Exibe uma mensagem de erro se houver problemas ao conectar com o servidor
                console.error('Erro ao conectar com o servidor:', error);

                Swal.fire({
                    title: 'Atenção!',
                    text: 'Erro ao conectar com o servidor: ',
                    icon: 'warning', // Ícone de aviso
                    confirmButtonText: 'OK' // Botão de confirmação
                });
            });
    } catch (error) {
        // Exibe uma mensagem de erro se houver problemas ao decodificar o token
        console.error('Erro ao decodificar o token:', error);
        alert('Erro ao decodificar o token.');
        window.location.href = 'login.html'; // Redireciona para a página de login
    }
});
