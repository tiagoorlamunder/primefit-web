document.addEventListener("DOMContentLoaded", function () {
    // Simulação de uma chamada à API para buscar os dados do usuário
    fetch("/api/user-data")
        .then(response => response.json())
        .then(data => {
            const userWelcome = document.getElementById("userWelcome");
            const userPlans = document.getElementById("userPlans");

            // Exibe o nome do usuário
            userWelcome.textContent = data.name || "Usuário";

            // Verifica se o usuário possui planos
            if (data.plans && data.plans.length > 0) {
                data.plans.forEach(plan => {
                    const planDiv = document.createElement("div");
                    planDiv.classList.add("plan");
                    planDiv.innerHTML = `
                        <h3>Plano: ${plan.name}</h3>
                        <p>Status: ${plan.status}</p>
                        <p>Validade: ${plan.validity}</p>
                    `;
                    userPlans.appendChild(planDiv);
                });
            } else {
                userPlans.innerHTML = "<p>Você ainda não assinou nenhum plano.</p>";
            }
        })
        .catch(error => {
            console.error("Erro ao buscar dados do usuário:", error);
            document.getElementById("userPlans").innerHTML = "<p>Erro ao carregar os dados.</p>";
        });
});
