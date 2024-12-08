describe('Main Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })
  
    it('loads plans successfully', () => {
      cy.get('#plans').should('exist')
      cy.get('#plans .u-repeater-item').should('have.length.greaterThan', 0)
    })
  
    it('displays login and register links when not authenticated', () => {
      cy.get('#loginLink').should('be.visible')
      cy.get('#registerLink').should('be.visible')
      cy.get('#logoutLink').should('not.be.visible')
      cy.get('#accountLink').should('not.be.visible')
      cy.get('#userWelcome').should('not.be.visible')
    })
  
    it('displays user info and logout link when authenticated', () => {
      // Mock localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-token')
        win.localStorage.setItem('name', 'Test User')
      })
  
      cy.reload()
  
      cy.get('#loginLink').should('not.be.visible')
      cy.get('#registerLink').should('not.be.visible')
      cy.get('#logoutLink').should('be.visible')
      cy.get('#accountLink').should('be.visible')
      cy.get('#userWelcome').should('be.visible')
      cy.get('#usernameDisplay').should('contain', 'Test User')
    })
  
    it('logs out successfully', () => {
      // Mock localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-token')
        win.localStorage.setItem('name', 'Test User')
      })
  
      cy.reload()
  
      cy.get('#logoutLink').click()
  
      // Check if SweetAlert2 confirmation appears
      cy.get('.swal2-confirm').click()
  
      // After confirming logout
      cy.get('#loginLink').should('be.visible')
      cy.get('#registerLink').should('be.visible')
      cy.get('#logoutLink').should('not.be.visible')
      cy.get('#accountLink').should('not.be.visible')
      cy.get('#userWelcome').should('not.be.visible')
    })
  })
  
  