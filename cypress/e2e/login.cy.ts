describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login.html')
    })
  
    it('displays the login form', () => {
      cy.get('#loginForm').should('be.visible')
      cy.get('#loginUsername').should('be.visible')
      cy.get('#loginPassword').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible').and('contain', 'Entrar')
    })
  
    it('displays link to registration page', () => {
      cy.contains('Não tem uma conta?').should('be.visible')
      cy.contains('Registre-se aqui').should('have.attr', 'href', 'register.html')
    })
  
    it('shows error for empty fields', () => {
      cy.get('button[type="submit"]').click()
      cy.get('#loginUsername:invalid').should('have.length', 1)
      cy.get('#loginPassword:invalid').should('have.length', 1)
    })
  
    it('handles successful login', () => {
      cy.intercept('POST', 'http://localhost:5000/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          message: 'Login successful'
        }
      }).as('loginRequest')
  
      cy.get('#loginUsername').type('testuser')
      cy.get('#loginPassword').type('password123')
      cy.get('button[type="submit"]').click()
  
      cy.wait('@loginRequest')
  
      cy.window().its('localStorage').invoke('getItem', 'token').should('eq', 'fake-jwt-token')
      cy.window().its('localStorage').invoke('getItem', 'username').should('eq', 'testuser')
  
      cy.get('.swal2-success').should('be.visible')
      cy.contains('Login bem-sucedido!').should('be.visible')
  
      cy.url().should('include', 'account.html')
    })
  
    it('handles failed login', () => {
      cy.intercept('POST', 'http://localhost:5000/api/auth/login', {
        statusCode: 401,
        body: {
          message: 'Invalid credentials'
        }
      }).as('loginRequest')
  
      cy.get('#loginUsername').type('wronguser')
      cy.get('#loginPassword').type('wrongpassword')
      cy.get('button[type="submit"]').click()
  
      cy.wait('@loginRequest')
  
      cy.get('.swal2-error').should('be.visible')
      cy.contains('Erro no login').should('be.visible')
      cy.contains('Verifique suas credenciais.').should('be.visible')
  
      cy.url().should('include', 'login.html')
    })
  
    it('handles server error', () => {
      cy.intercept('POST', 'http://localhost:5000/api/auth/login', {
        statusCode: 500,
        body: {
          message: 'Internal server error'
        }
      }).as('loginRequest')
  
      cy.get('#loginUsername').type('testuser')
      cy.get('#loginPassword').type('password123')
      cy.get('button[type="submit"]').click()
  
      cy.wait('@loginRequest')
  
      cy.get('.swal2-error').should('be.visible')
      cy.contains('Erro').should('be.visible')
      cy.contains('Erro ao conectar com o servidor.').should('be.visible')
  
      cy.url().should('include', 'login.html')
    })
  })
  
  