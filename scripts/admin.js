document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const planForm = document.getElementById('planForm');
    const userTableBody = document.getElementById('userTableBody');
    const planTableBody = document.getElementById('planTableBody');
    const contentDiv = document.getElementById('content');
    const permissionErrorDiv = document.getElementById('permissionError');
    const addUserBtn = document.getElementById('addUserBtn');
    const addPlanBtn = document.getElementById('addPlanBtn');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    const planModal = new bootstrap.Modal(document.getElementById('planModal'));

    // Verificar permissão
    const permission = localStorage.getItem('permission');
    if (permission !== '1') {
        permissionErrorDiv.classList.remove('d-none');
        return;
    }

    contentDiv.classList.remove('d-none');

    // Carregar usuários e planos ao iniciar a página
    loadUsers();
    loadPlans();

    // Adicionar eventos de clique aos botões
    saveUserBtn.addEventListener('click', saveUser);
    savePlanBtn.addEventListener('click', savePlan);
    addUserBtn.addEventListener('click', () => {
        clearForm('user');
        document.getElementById('userModalLabel').textContent = 'Adicionar Usuário';
    });
    addPlanBtn.addEventListener('click', () => {
        clearForm('plan');
        document.getElementById('planModalLabel').textContent = 'Adicionar Plano';
    });

    // Função para obter o token de autenticação
    function getAuthToken() {
        return localStorage.getItem('token');
    }

    // Função para fazer requisições autenticadas
    async function authenticatedFetch(url, options = {}) {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Token de autenticação não encontrado');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        return fetch(url, { ...options, headers });
    }

    // Funções para usuários
    async function loadUsers() {
        try {
            const response = await authenticatedFetch('https://primefit-api.onrender.com/api/user/');
            if (!response.ok) {
                throw new Error('Não foi possível carregar os usuários');
            }
            const users = await response.json();
            displayUsers(users);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            showAlert('error', 'Erro ao carregar usuários', error.message);
        }
    }

    function displayUsers(users) {
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = userTableBody.insertRow();
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="viewUser('${user._id}')">Ver</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Excluir</button>
                </td>
            `;
        });
    }

    window.viewUser = async function (userId) {
        try {
            const response = await authenticatedFetch(`https://primefit-api.onrender.com/api/user/info?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Não foi possível obter as informações do usuário');
            }
            const user = await response.json();
            document.getElementById('userId').value = userId;
            document.getElementById('username').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone;
            document.getElementById('password').value = ''; // Limpar o campo de senha por segurança
            document.getElementById('userModalLabel').textContent = 'Editar Usuário';
            userModal.show();
        } catch (error) {
            console.error('Erro ao visualizar usuário:', error);
            showAlert('error', 'Erro ao visualizar usuário', error.message);
        }
    }

    async function saveUser() {
        const userId = document.getElementById('userId').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        const userData = {
            username: username,
            email: email,
            phone: phone,
            password: password
        };

        try {
            let response;
            if (userId) {
                // Atualizar usuário existente
                response = await authenticatedFetch(`https://primefit-api.onrender.com/api/user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
            } else {
                // Criar novo usuário
                response = await authenticatedFetch('https://primefit-api.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
            }

            if (!response.ok) {
                throw new Error('Erro ao salvar usuário');
            }

            userModal.hide();
            clearForm('user');
            loadUsers();
            showAlert('success', 'Sucesso', 'Usuário salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            showAlert('error', 'Erro ao salvar usuário', error.message);
        }
    }

    window.deleteUser = async function (userId) {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter esta ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await authenticatedFetch(`https://primefit-api.onrender.com/api/user/${userId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Erro ao excluir usuário');
                }

                loadUsers();
                showAlert('success', 'Sucesso', 'Usuário excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                showAlert('error', 'Erro ao excluir usuário', error.message);
            }
        }
    }

    // Funções para planos
    async function loadPlans() {
        try {
            const response = await authenticatedFetch('https://primefit-api.onrender.com/api/plans/');
            if (!response.ok) {
                throw new Error('Não foi possível carregar os planos');
            }
            const plans = await response.json();
            displayPlans(plans);
        } catch (error) {
            console.error('Erro ao carregar planos:', error);
            showAlert('error', 'Erro ao carregar planos', error.message);
        }
    }

    function displayPlans(plans) {
        planTableBody.innerHTML = '';
        plans.forEach(plan => {
            const row = planTableBody.insertRow();
            row.innerHTML = `
                <td>${plan.name}</td>
                <td>${plan.description}</td>
                <td>${plan.price}</td>
                <td>${plan.price}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deletePlan('${plan._id}')">Excluir</button>
                </td>
            `;
        });
    }

    window.viewPlan = async function (planId) {
        try {
            const response = await authenticatedFetch(`https://primefit-api.onrender.com/api/plans/${planId}`);
            if (!response.ok) {
                throw new Error('Não foi possível obter as informações do plano');
            }
            const plan = await response.json();
            document.getElementById('planId').value = planId;
            document.getElementById('planName').value = plan.name;
            document.getElementById('planDescription').value = plan.description;
            document.getElementById('planPrice').value = plan.price;
            document.getElementById('planModalLabel').textContent = 'Editar Plano';
            planModal.show();
        } catch (error) {
            console.error('Erro ao visualizar plano:', error);
            showAlert('error', 'Erro ao visualizar plano', error.message);
        }
    }

    async function savePlan() {
        const planId = document.getElementById('planId').value;
        const name = document.getElementById('planName').value;
        const description = document.getElementById('planDescription').value;
        const price = document.getElementById('planPrice').value;

        const planData = {
            name: name,
            description: description,
            price: parseFloat(price)
        };

        try {
            let response;
            if (planId) {
                // Atualizar plano existente
                response = await authenticatedFetch(`https://primefit-api.onrender.com/api/plans/${planId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(planData),
                });
            } else {
                // Criar novo plano
                response = await authenticatedFetch('https://primefit-api.onrender.com/api/plans/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(planData),
                });
            }

            if (!response.ok) {
                throw new Error('Erro ao salvar plano');
            }

            planModal.hide();
            clearForm('plan');
            loadPlans();
            showAlert('success', 'Sucesso', 'Plano salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar plano:', error);
            showAlert('error', 'Erro ao salvar plano', error.message);
        }
    }

    window.deletePlan = async function (planId) {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter esta ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await authenticatedFetch(`https://primefit-api.onrender.com/api/plans/${planId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Erro ao excluir plano');
                }

                loadPlans();
                showAlert('success', 'Sucesso', 'Plano excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir plano:', error);
                showAlert('error', 'Erro ao excluir plano', error.message);
            }
        }
    }

    // Função para limpar o formulário
    function clearForm(formType) {
        if (formType === 'user') {
            document.getElementById('userId').value = '';
            document.getElementById('username').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('password').value = '';
        } else if (formType === 'plan') {
            document.getElementById('planId').value = '';
            document.getElementById('planName').value = '';
            document.getElementById('planDescription').value = '';
            document.getElementById('planPrice').value = '';
        }
    }

    // Função para exibir alertas usando SweetAlert2
    function showAlert(icon, title, text) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            customClass: {
                container: 'swal-dark'
            }
        });
    }
});