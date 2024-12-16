document.addEventListener('DOMContentLoaded', function() {
    // Função para decodificar o JWT
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

    // Decodifica o token JWT para obter o ID do usuário
    let userId;
    try {
        const decodedToken = jwt_decode(token);
        userId = decodedToken.userId;
        if (!userId) {
            Swal.fire({
                title: 'Atenção!',
                text: 'ID do usuário não encontrado no token JWT.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            window.location.href = 'login.html';
            return;
        }
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        alert('Erro ao decodificar o token.');
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados do usuário
    fetchUserData(userId);

    // Adicionar botão de edição
    const userInfo = document.getElementById('userInfo');
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    // Adiciona um ouvinte de evento ao botão de edição para alternar entre os modos de visualização e edição
    editButton.addEventListener('click', toggleEditMode);
    userInfo.appendChild(editButton);

    // Função para obter o token do localStorage
    function getToken() {
        return localStorage.getItem('token');
    }

    // Função para buscar os dados do usuário
    function fetchUserData(userId) {
        const token = getToken();
        if (!token) {
            console.error('Token não encontrado');
            return;
        }

        // Realiza uma requisição GET para obter as informações do usuário
        fetch(`http://127.0.0.1:5000/api/user/info?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na autenticação ou erro na API');
            }
            return response.json();
        })
        .then(data => {
            displayUserData(data);
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error));
    }

    // Função para exibir os dados do usuário na página
    function displayUserData(userData) {
        localStorage.setItem('name', userData.name);
        localStorage.setItem('permission', userData.permission);
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userPhone').textContent = userData.phone;
        document.getElementById('userPlan').textContent = userData.planName;
        document.getElementById('planDescription').textContent = userData.planDescription;
    }

    // Função para alternar entre o modo de visualização e o modo de edição
    function toggleEditMode() {
        const isEditing = userInfo.classList.toggle('editing');
        if (isEditing) {
            convertToEditableFields();
            editButton.textContent = 'Salvar';
        } else {
            saveUserData();
            convertToReadOnlyFields();
            editButton.textContent = 'Editar';
        }
    }

    // Converte os campos de exibição para campos de edição
    function convertToEditableFields() {
        const fields = ['userName', 'userEmail', 'userPhone'];
        fields.forEach(field => {
            const span = document.getElementById(field);
            const input = document.createElement('input');
            input.type = field === 'userEmail' ? 'email' : 'text';
            input.value = span.textContent;
            span.parentNode.replaceChild(input, span);
        });
    }

    // Converte os campos de edição de volta para campos somente leitura
    function convertToReadOnlyFields() {
        const inputs = userInfo.querySelectorAll('input');
        inputs.forEach(input => {
            const span = document.createElement('span');
            span.id = input.parentNode.firstChild.textContent.toLowerCase().replace(':', '').trim();
            span.textContent = input.value;
            input.parentNode.replaceChild(span, input);
        });
    }

    // Função para salvar os dados do usuário
    function saveUserData() {
        const userData = {
            username: userInfo.querySelector('input[type="text"]').value,
            email: userInfo.querySelector('input[type="email"]').value,
            phone: userInfo.querySelectorAll('input[type="text"]')[1].value
        };

        const token = getToken();
        if (!token) {
            console.error('Token não encontrado');
            return;
        }
        const id = parseJWT(token).payload.userId;
        // Faz uma requisição PUT para atualizar os dados do usuário
        fetch(`http://127.0.0.1:5000/api/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na autenticação ou erro na API');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados atualizados com sucesso:', data);
            displayUserData(data);
        })
        .catch(error => console.error('Erro ao atualizar dados:', error));
    }

});