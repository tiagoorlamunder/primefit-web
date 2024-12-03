// Adiciona um ouvinte de evento para quando o conteúdo do DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Obtém referências aos elementos da página
    function parseJWT(token) {
        // Divide o JWT em suas 3 partes (header, payload e signature)
        const [header, payload, signature] = token.split('.');
    
        // Decodifica as partes base64 URL-encoded
        const decodedHeader = JSON.parse(atob(header));
        const decodedPayload = JSON.parse(atob(payload));
    
        // Exibe as partes decodificadas
        console.log("Header:", decodedHeader);
        console.log("Payload:", decodedPayload);
        
        return {
            header: decodedHeader,
            payload: decodedPayload,
            signature: signature
        };
    }
        const loginLink = document.getElementById('loginLink');
        const registerLink = document.getElementById('registerLink');
        const logoutLink = document.getElementById('logoutLink');
        const accountLink = document.getElementById('accountLink');
        const userWelcome = document.getElementById('userWelcome');
        const usernameDisplay = document.getElementById('usernameDisplay');
    
        function loadPlans() {
            fetch('https://primefit-api.onrender.com/api/plans/')
                .then(response => response.json())
                .then(plans => {
                    const plansContainer = document.getElementById('plans');
                    plansContainer.innerHTML = ''; // Clear previous content
    
                    plans.forEach(plan => {
                        const planElement = document.createElement('div');
                        planElement.classList.add('u-align-center', 'u-container-align-center', 'u-container-style', 'u-list-item', 'u-repeater-item', 'u-shape-rectangle', 'u-white');
                        planElement.setAttribute('data-animation-name', 'customAnimationIn');
                        planElement.setAttribute('data-animation-duration', '1750');
                        planElement.setAttribute('data-animation-delay', '0');
    
                        planElement.innerHTML = `
                            <div class="u-container-layout u-similar-container u-valign-top u-container-layout-1">
                                <div class="u-align-center u-container-align-center u-container-style u-expanded-width u-group u-palette-2-base u-group-1"
                                    data-animation-name="" data-animation-duration="0" data-animation-delay="0" data-animation-direction="">
                                    <div class="u-container-layout u-valign-middle u-container-layout-2">
                                        <h4 class="u-align-center u-text u-text-default u-text-2" data-animation-name="customAnimationIn"
                                            data-animation-duration="1500" data-animation-delay="500">${plan.name}</h4>
                                    </div>
                                </div>
                                <p class="u-text u-text-3">${plan.description}</p>
                                <a href="#" onclick="confirmSubscription('${plan._id}')"
                                    class="u-border-2 u-border-active-black u-border-hover-black u-border-no-left u-border-no-right u-border-no-top u-border-palette-2-base u-bottom-left-radius-0 u-bottom-right-radius-0 u-btn u-button-style u-none u-radius-0 u-text-active-palette-3-base u-text-body-color u-text-hover-palette-3-base u-top-left-radius-0 u-top-right-radius-0 u-btn-1">Assinar plano</a>
                            </div>
                        `;
    
                        plansContainer.appendChild(planElement);
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar planos:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Não foi possível carregar os planos. Por favor, tente novamente mais tarde.',
                        background: '#2a2a2a',
                        color: '#ffffff'
                    });
                });
        }
    
        function updateUIBasedOnAuth() {
            const token = localStorage.getItem('token');
            if (token) {
                loginLink.classList.add('hide');
                registerLink.classList.add('hide');
                logoutLink.classList.remove('hide');
                accountLink.classList.remove('hide');
                userWelcome.classList.remove('hide');
                usernameDisplay.textContent = localStorage.getItem('name');
            } else {
                loginLink.classList.remove('hide');
                registerLink.classList.remove('hide');
                logoutLink.classList.add('hide');
                accountLink.classList.add('hide');
                userWelcome.classList.add('hide');
            }
        }
    
        logoutLink.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            Swal.fire({
                icon: 'success',
                title: 'Você saiu com sucesso.',
                text: 'Voltando à página inicial.',
                confirmButtonText: 'OK',
                background: '#2a2a2a',
                color: '#ffffff'
            }).then(() => {
                location.reload();
            });
        });
    
        window.confirmSubscription = function(planId) {
            Swal.fire({
                title: 'Confirmar assinatura',
                text: "Você tem certeza que deseja assinar este plano?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, assinar!',
                cancelButtonText: 'Cancelar',
                background: '#2a2a2a',
                color: '#ffffff'
            }).then((result) => {
                if (result.isConfirmed) {
                    subscribeToPlan(planId);
                }
            });
        }
    
        window.subscribeToPlan = function(planId) {
            const token = localStorage.getItem('token');
    
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Você precisa estar logado para assinar um plano.',
                    background: '#2a2a2a',
                    color: '#ffffff'
                });
                return;
            }
    
            fetch('https://primefit-api.onrender.com/api/plans/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: parseJWT(token).payload.userId, planId })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao assinar o plano');
                }
                return response.text();
            })
            .then(message => {
                Swal.fire({
                    icon: 'success',
                    title: 'Inscrição realizada!',
                    text: message,
                    background: '#2a2a2a',
                    color: '#ffffff'
                });
            })
            .catch(error => {
                console.error('Erro ao associar plano:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Ocorreu um erro ao tentar se inscrever no plano.',
                    background: '#2a2a2a',
                    color: '#ffffff'
                });
            });
        }
    
        loadPlans();
        updateUIBasedOnAuth();

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
        usernameDisplay.textContent = localStorage.getItem('name');
    } else {
        // Se o token não existir, mostra links para login e registro e oculta os demais
        loginLink.classList.remove('hide');
        registerLink.classList.remove('hide');
        logoutLink.classList.add('hide');
        accountLink.classList.add('hide');
        userWelcome.classList.add('hide');
    }

    // Adiciona um ouvinte de evento ao link de logout
    logoutLink.addEventListener('click', () => {
        // Remove o token e o nome de usuário do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        Swal.fire({
            icon: 'success',
            title: 'Você saiu com sucesso.',
            text: 'Voltando à página inicial.',
            confirmButtonText: 'OK'
        }).then(() => {
            // Após o clique no botão OK, recarrega a página
            location.reload(); // Recarrega a página para refletir as alterações
        });
        
    });

    // Define a função global para se inscrever em um plano
    window.subscribeToPlan = function (planId) {
        // Obtém o token JWT armazenado no localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token JWT não encontrado no localStorage');
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Faça login.',
            });
            return;
        }

        // Decodifica o token JWT para obter o ID do usuário
        const decodedToken = parseJWT(token).payload
        const userId = decodedToken.userId;

        if (!userId) {
            console.error('ID do usuário não encontrado no token JWT');
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'ID do usuário não encontrado no token.',
            });
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
                Swal.fire({
                    icon: 'success',
                    title: 'Inscrição realizada!',
                    text: message,
                });
            })
            .catch(error => {
                console.error('Erro ao associar plano:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Ocorreu um erro ao tentar se inscrever no plano.',
                });
            }); // Exibe um erro se a requisição falhar
    }
});
