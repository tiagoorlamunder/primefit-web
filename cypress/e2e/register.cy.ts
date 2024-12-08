describe('Registration Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/register.html')
    })
  
    it('displays the registration form', () => {
      cy.get('#registerForm').should('be.visible')
      cy.get('#registerUsername').should('be.visible')
      cy.get('#registerEmail').should('be.visible')
      cy.get('#registerPhone').should('be.visible')
      cy.get('#registerPassword').should('be.visible')
      cy.get('#registerConfirmPassword').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible').and('contain', 'Registrar')
    })
  
    it('displays link to login page', () => {
      cy.contains('Já tem uma conta?').should('be.visible')
      cy.contains('Faça login aqui').should('have.attr', 'href', 'login.html')
    })
  
    it('shows error for empty fields', () => {
      cy.get('button[type="submit"]').click()
      cy.get('#registerUsername:invalid').should('have.length', 1)
      cy.get('#registerEmail:invalid').should('have.length', 1)
      cy.get('#registerPhone:invalid').should('have.length', 1)
      cy.get('#registerPassword:invalid').should('have.length', 1)
      cy.get('#registerConfirmPassword:invalid').should('have.length', 1)
    })
  
    it('shows error for mismatched passwords', () => {
      cy.get('#registerUsername').type('testuser')
      cy.get('#registerEmail').type('test@example.com')
      cy.get('#registerPhone').type('1234567890')
      cy.get('#registerPassword').type('password123')
      cy.get('#registerConfirmPassword').type('password456')
      cy.get('button[type="submit"]').click()
  
      cy.get('.swal2-warning').should('be.visible')
      cy.contains('As senhas não coincidem.').should('be.visible')
    })
  
    it('handles successful registration', () => {
      cy.intercept('POST', 'http://localhost:5000/api/auth/register', {
        statusCode: 200,
        body: {
          message: 'Registration successful'
        }
      }).as('registerRequest')
  
      cy.get('#registerUsername').type('newuser')
      cy.get('#registerEmail').type('newuser@example.com')
      cy.get('#registerPhone').type('9876543210')
      cy.get('#registerPassword').type('newpassword123')
      cy.get('#registerConfirmPassword').type('newpassword123')
      cy.get('button[type="submit"]').click()
  
      cy.wait('@registerRequest')
  
      cy.get('.swal2-success').should('be.visible')
      cy.contains('Cadastro realizado com sucesso!').should('be.visible')
  
      cy.get('.swal2-confirm').click()
  
      cy.url().should('include', 'login.html')
    })
  
    it('handles registration error', () => {
      cy.intercept('POST', 'http://localhost:5000/api/auth/register', {
        statusCode: 400,
        body: 'Username already exists'
      }).as('registerRequest')
  
      cy.get('#registerUsername').type('existinguser')
      cy.get('#registerEmail').type('existing@example.com')
      cy.get('#registerPhone').type('1231231234')
      cy.get('#registerPassword').type('password123')
      cy.get('#registerConfirmPassword').type('password123')
      cy.get('button[type="submit"]').click()
  
      cy.wait('@registerRequest')
  
      cy.get('.swal2-error').should('be.visible')
      cy.contains('Erro: Username already exists').should('be.visible')
    })
  
    it('handles server error', () => {
      cy.intercept('POST', 'http://localhost:5000/api/auth/register', {
        statusCode: 500,
        body: 'Internal server error'
      }).as('registerRequest')
  
      cy.get('#registerUsername').type('newuser')
      cy.get('#registerEmail').type('newuser@example.com')
      cy.get('#registerPhone').type('9876543210')
      cy.get('#registerPassword').type('newpassword123')
      cy.get('#registerConfirmPassword').type('newpassword123')
      cy.get('button[type="submit"]').click()
  
      cy.wait('@registerRequest')
  
      cy.get('.swal2-error').should('be.visible')
      cy.contains('Erro ao conectar com o servidor.').should('be.visible')
      cy.contains('Erro: Internal server error').should('be.visible')
    })
  })
  
  