document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const accountLink = document.getElementById('accountLink');
    const userWelcome = document.getElementById('userWelcome');
    const usernameDisplay = document.getElementById('usernameDisplay');

    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    if (token) {
        const username = localStorage.getItem('username');
        loginLink.classList.add('hide');
        registerLink.classList.add('hide');
        logoutLink.classList.remove('hide');
        accountLink.classList.remove('hide');
        userWelcome.classList.remove('hide');
        usernameDisplay.textContent = username;
    }

    // Função para logout
    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert('Você saiu com sucesso.');
        location.reload();
    });

    // Carregar planos de assinatura da API
    fetch('http://localhost:5000/api/plans')
        .then(response => response.json())
        .then(plans => {
            const plansContainer = document.getElementById('plans');
            plans.forEach(plan => {
                const planElement = document.createElement('div');
                planElement.classList.add('plan');
                planElement.innerHTML = `
                    <h3>${plan.name}</h3>
                    <p>${plan.description}</p>
                    <p>Preço: R$${plan.price.toFixed(2)}</p>
                `;
                plansContainer.appendChild(planElement);
            });
        })
        .catch(error => console.error('Erro ao carregar planos:', error));
});
