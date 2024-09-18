document.addEventListener('DOMContentLoaded', () => {
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
                    <button onclick="subscribeToPlan('${plan._id}')">Escolher Plano</button>
                `;
                plansContainer.appendChild(planElement);
            });
        })
        .catch(error => console.error('Erro ao carregar planos:', error));

    // Função para associar um plano ao usuário
    window.subscribeToPlan = function(planId) {
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

        console.log(`Enviando requisição para associar plano. userId: ${userId}, planId: ${planId}`);

        fetch('http://localhost:5000/api/plans/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
