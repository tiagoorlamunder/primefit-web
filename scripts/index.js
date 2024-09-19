document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const accountLink = document.getElementById('accountLink');
    const userWelcome = document.getElementById('userWelcome');
    const usernameDisplay = document.getElementById('usernameDisplay');

    const token = localStorage.getItem('token');
    if (token) {
        const username = localStorage.getItem('username');
        loginLink.classList.add('hide');
        registerLink.classList.add('hide');
        logoutLink.classList.remove('hide');
        accountLink.classList.remove('hide');
        userWelcome.classList.remove('hide');
        usernameDisplay.textContent = username;
    } else {
        loginLink.classList.remove('hide');
        registerLink.classList.remove('hide');
        logoutLink.classList.add('hide');
        accountLink.classList.add('hide');
        userWelcome.classList.add('hide');
    }

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
                    <button onclick="subscribeToPlan('${plan._id}')">Escolher Plano</button>
                `;
                plansContainer.appendChild(planElement);
            });
        })
        .catch(error => console.error('Erro ao carregar planos:', error));

    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert('Você saiu com sucesso.');
        location.reload();
    });

    window.subscribeToPlan = function (planId) {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token JWT não encontrado no localStorage');
            alert('Erro: Token JWT não encontrado.');
            return;
        }

        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;

        if (!userId) {
            console.error('ID do usuário não encontrado no token JWT');
            alert('Erro: ID do usuário não encontrado no token.');
            return;
        }

        fetch('http://localhost:5000/api/plans/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, planId })
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
            })
            .catch(error => console.error('Erro ao associar plano:', error));
    }
});
