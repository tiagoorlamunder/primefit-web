document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;

        if (!userId) {
            alert('ID do usuário não encontrado no token JWT.');
            window.location.href = 'login.html';
            return;
        }

        fetch(`http://localhost:5000/api/user/info?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('userName').textContent = data.name || 'Nome não disponível';
                document.getElementById('userEmail').textContent = data.email || 'E-mail não disponível';
                document.getElementById('userPhone').textContent = data.phone || 'Telefone não disponível';

                if (data.planName && data.planDescription) {
                    document.getElementById('userPlan').textContent = data.planName;
                    document.getElementById('planDescription').textContent = data.planDescription;
                } else {
                    document.getElementById('userPlan').textContent = 'Sem plano';
                    document.getElementById('planDescription').textContent = 'Descrição não disponível';
                }
            })
            .catch(error => {
                console.error('Erro ao conectar com o servidor:', error);
                alert('Erro ao conectar com o servidor: ' + error.message);
            });
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        alert('Erro ao decodificar o token.');
        window.location.href = 'login.html';
    }
});
