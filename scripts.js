document.addEventListener('DOMContentLoaded', () => {
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
