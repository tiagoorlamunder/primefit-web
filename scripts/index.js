// Adiciona um ouvinte de evento para quando o conteúdo do DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Obtém referências aos elementos da página
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const accountLink = document.getElementById('accountLink');
    const userWelcome = document.getElementById('userWelcome');
    const usernameDisplay = document.getElementById('usernameDisplay');

    // Obtém o token JWT armazenado no localStorage
    const token = localStorage.getItem('token');
    if (token) {
        // Se o token existir, mostra links relevantes para usuários logados e oculta para não logados
        const username = localStorage.getItem('username');
        loginLink.classList.add('hide');
        registerLink.classList.add('hide');
        logoutLink.classList.remove('hide');
        accountLink.classList.remove('hide');
        userWelcome.classList.remove('hide');
        usernameDisplay.textContent = username;
    } else {
        // Se o token não existir, mostra links para login e registro e oculta os demais
        loginLink.classList.remove('hide');
        registerLink.classList.remove('hide');
        logoutLink.classList.add('hide');
        accountLink.classList.add('hide');
        userWelcome.classList.add('hide');
    }

    // Faz uma requisição GET para obter a lista de planos disponíveis
    fetch('https://primefit-api.onrender.com/api/plans')
        .then(response => response.json())
        .then(plans => {
            // Obtém o container onde os planos serão exibidos
            const plansContainer = document.getElementById('plans');
            plans.forEach(plan => {
                // Cria um elemento para cada plano e adiciona ao container
                const planElement = document.createElement('div');
                planElement.classList.add('plan');
                planElement.innerHTML = `
                    <h3>${plan.name}</h3>
                    <p>${plan.description}</p>
                    <p>Preço: R$${plan.price.toFixed(2)}</p>
                    <button onclick="subscribeToPlan('${plan._id}')">Escolher Plano</button>
                `;
                plansContainer.appendChild(planElement);
            });
        })
        .catch(error => console.error('Erro ao carregar planos:', error));

    // Adiciona um ouvinte de evento ao link de logout
    logoutLink.addEventListener('click', () => {
        // Remove o token e o nome de usuário do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert('Você saiu com sucesso.');
        location.reload(); // Recarrega a página para refletir as alterações
    });

    // Define a função global para se inscrever em um plano
    window.subscribeToPlan = function (planId) {
        // Obtém o token JWT armazenado no localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token JWT não encontrado no localStorage');
            alert('Erro: Token JWT não encontrado.');
            return;
        }

        // Decodifica o token JWT para obter o ID do usuário
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;

        if (!userId) {
            console.error('ID do usuário não encontrado no token JWT');
            alert('Erro: ID do usuário não encontrado no token.');
            return;
        }

        // Faz uma requisição POST para se inscrever no plano selecionado
        fetch('https://primefit-api.onrender.com/api/plans/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Inclui o token JWT no cabeçalho de autorização
            },
            body: JSON.stringify({ userId, planId }) // Envia o ID do usuário e o ID do plano como corpo da requisição
        })
            .then(response => response.text())
            .then(message => {
                alert(message); // Exibe uma mensagem de confirmação após a inscrição
            })
            .catch(error => console.error('Erro ao associar plano:', error)); // Exibe um erro se a requisição falhar
    }
});
