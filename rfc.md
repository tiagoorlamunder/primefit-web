# RFC - PrimeFit - Sistema de Gestão de Planos de Assinatura em Academias

## Visão Geral

O projeto **PrimeFit** é um sistema completo para a gestão de planos de assinatura em academias. O sistema abrange tanto o **front-end**, acessível pelo usuário final, quanto o **back-end** (API), responsável pelo processamento de dados e comunicação com o banco de dados. O objetivo deste sistema é permitir que academias gerenciem suas assinaturas, planos de pagamento, usuários e informações relacionadas de forma eficiente e segura.

Este documento descreve o funcionamento técnico detalhado do projeto, suas funcionalidades, arquitetura e fluxos de dados. Ele abrange tanto o back-end (API) quanto o front-end, detalhando os componentes, casos de uso e as interações entre o cliente e o servidor.

## Estrutura do Projeto

O **PrimeFit** é composto por duas partes principais:

1. **PrimeFit Web (Front-end)**
2. **PrimeFit API (Back-end)**

### PrimeFit Web (Front-end)

A parte do front-end do projeto é responsável por fornecer uma interface interativa e amigável ao usuário. O usuário poderá interagir com a plataforma através de páginas como:

- **Index (index.html)**: Página inicial do sistema, com informações sobre os planos e funcionalidades da academia.
- **Login (login.html)**: Página de login, onde o usuário pode autenticar-se no sistema.
- **Register (register.html)**: Página de registro para novos usuários.
- **Account (account.html)**: Página de perfil do usuário, onde são exibidas as informações relacionadas à conta e ao plano de assinatura.

Os arquivos JavaScript responsáveis por interagir com o back-end são:

- **account.js**: Lida com a lógica para exibir os dados da conta do usuário.
- **login.js**: Gerencia o login e redireciona o usuário conforme seu status de autenticação.
- **register.js**: Controla o processo de registro de novos usuários.
- **admin.js**: Funcionalidade para administração de usuários e planos (página admin.html).
- **index.js**: Controla a lógica da página inicial.

A arquitetura da aplicação segue o modelo MVC (Model-View-Controller), separando claramente as responsabilidades de exibição, lógica de negócios e comunicação com o servidor.

### PrimeFit API (Back-end)

A API do **PrimeFit** é construída utilizando **Node.js** e **Express.js**, oferecendo endpoints RESTful para interagir com os dados do sistema. Ela permite que o front-end se comunique com o back-end de maneira eficiente. A API é responsável por gerenciar:

- **Usuários**: Cadastro, login, recuperação de dados de conta.
- **Planos**: Cadastro, edição e consulta de planos de assinatura.
- **Autenticação**: Sistema de login e geração de tokens JWT.

#### Endpoints da API

1. **POST /api/login**
   - Descrição: Endpoint responsável por autenticar o usuário no sistema.
   - Parâmetros:
     - `email`: Email do usuário.
     - `password`: Senha do usuário.
   - Resposta:
     - 200 OK: Retorna o token JWT.
     - 401 Unauthorized: Caso as credenciais sejam inválidas.

2. **POST /api/register**
   - Descrição: Endpoint responsável por registrar um novo usuário no sistema.
   - Parâmetros:
     - `name`: Nome completo do usuário.
     - `email`: Email do usuário.
     - `password`: Senha do usuário.
   - Resposta:
     - 201 Created: Usuário criado com sucesso.
     - 400 Bad Request: Caso algum dado esteja faltando ou inválido.

3. **GET /api/user/info**
   - Descrição: Endpoint para recuperar as informações do usuário logado.
   - Parâmetros:
     - `userId`: ID do usuário (passado no header Authorization).
   - Resposta:
     - 200 OK: Retorna os dados do usuário e plano de assinatura.
     - 404 Not Found: Caso o usuário não exista.

4. **GET /api/plans**
   - Descrição: Endpoint para consultar os planos de assinatura disponíveis.
   - Resposta:
     - 200 OK: Retorna a lista de planos.
     - 204 No Content: Caso não haja planos cadastrados.

5. **PUT /api/user/update**
   - Descrição: Endpoint para atualizar as informações do usuário.
   - Parâmetros:
     - `userId`: ID do usuário a ser atualizado.
     - `name`: Nome do usuário.
     - `email`: Email do usuário.
   - Resposta:
     - 200 OK: Atualização bem-sucedida.
     - 400 Bad Request: Caso os dados fornecidos sejam inválidos.

### Banco de Dados

O sistema utiliza **MongoDB** como banco de dados para armazenar informações sobre usuários, planos e sessões de login. As coleções principais são:

- **Users**: Armazena os dados dos usuários, como nome, email, senha criptografada e dados de plano.
- **Plans**: Armazena os planos de assinatura, com detalhes como nome do plano, preço, e duração.

### Fluxo de Dados

1. O usuário acessa a aplicação web e faz login através da página de **login**.
2. A aplicação faz uma requisição **POST /api/login** para autenticar o usuário e obter o token JWT.
3. Com o token JWT, a aplicação faz requisições subsequentes para recuperar e exibir os dados do usuário (informações pessoais, planos) usando a **GET /api/user/info**.
4. O usuário pode atualizar seus dados de conta através da **PUT /api/user/update**, passando os dados necessários no corpo da requisição.
5. A administração pode adicionar, editar ou excluir planos de assinatura via endpoints **POST**, **PUT** e **DELETE** da API.

## Casos de Uso

### Caso de Uso 1: Registro de Novo Usuário

**Descrição**: O usuário visita a página de registro (**register.html**) e preenche os campos de nome, email e senha. O sistema verifica se os dados são válidos e, em caso afirmativo, cria uma conta e envia um email de confirmação.

**Fluxo**:

1. O usuário acessa a página de registro e preenche o formulário.
2. Ao clicar em "Registrar", o sistema envia uma requisição **POST /api/register** com os dados fornecidos.
3. O back-end valida os dados e cria o usuário no banco de dados.
4. O sistema envia um email de confirmação ao usuário.

### Caso de Uso 2: Login de Usuário

**Descrição**: O usuário faz login na aplicação para acessar seu painel de usuário (**account.html**).

**Fluxo**:

1. O usuário acessa a página de login (**login.html**) e preenche os campos de email e senha.
2. O sistema envia uma requisição **POST /api/login** com as credenciais.
3. Caso as credenciais sejam válidas, o sistema retorna um token JWT.
4. O token JWT é armazenado localmente e usado para autenticar futuras requisições.

### Caso de Uso 3: Visualização de Dados do Usuário

**Descrição**: Após o login, o usuário acessa a página de conta (**account.html**) e visualiza suas informações pessoais e plano de assinatura.

**Fluxo**:

1. O usuário acessa a página de conta, que envia uma requisição **GET /api/user/info** com o token JWT.
2. O sistema retorna as informações do usuário, incluindo dados pessoais e plano de assinatura, que são exibidos na interface.

### Caso de Uso 4: Alteração de Dados do Usuário

**Descrição**: O usuário altera seus dados pessoais (nome, email) na página de conta.

**Fluxo**:

1. O usuário acessa a página de conta e clica em "Editar Perfil".
2. O sistema exibe um formulário para atualizar os dados.
3. O usuário submete os dados alterados, e uma requisição **PUT /api/user/update** é feita com os novos dados.
4. O sistema valida e atualiza os dados no banco de dados.

## Detalhes de Segurança e CI/CD

### Autenticação e Autorização

A autenticação no sistema é realizada utilizando **tokens JWT**. O token é gerado ao realizar o login e deve ser enviado nas requisições subsequentes para acessar as rotas protegidas, como **GET /api/user/info**.

### CI/CD

O projeto é configurado com uma pipeline **CI/CD** utilizando **GitHub Actions** para automação de testes e deployment. A cada push para o repositório, a pipeline realiza:

1. **Testes Unitários**: Verificação do funcionamento correto de funções e métodos.
2. **Build**: Criação do build de produção do front-end.
3. **Deploy**: Envio do código para o ambiente de produção ou staging.

## Conclusão

Este projeto foi desenvolvido com o objetivo de fornecer uma solução eficiente para gestão de planos de assinatura em academias. Ele combina um front-end interativo com um back-end robusto, oferecendo um sistema escalável e seguro para administrar usuários e planos.

A arquitetura proposta, com a utilização de **MongoDB**, **Node.js** e **Express.js**, garante desempenho e flexibilidade para futuras extensões e manutenção.