describe('Plan Subscription', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      // Mock authenticated user
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-token')
        win.localStorage.setItem('name', 'Test User')
      })
      cy.reload()
    })
  
    it('shows confirmation dialog when trying to subscribe', () => {
      cy.get('#plans .u-repeater-item').first().within(() => {
        cy.contains('Assinar plano').click()
      })
  
      cy.get('.swal2-confirm').should('be.visible')
      cy.get('.swal2-cancel').should('be.visible')
    })
  
    it('subscribes to a plan successfully', () => {
      // Intercept the subscription request
      cy.intercept('POST', 'http://localhost:5000/api/plans/subscribe', {
        statusCode: 200,
        body: 'Subscription successful',
      }).as('subscribeRequest')
  
      cy.get('#plans .u-repeater-item').first().within(() => {
        cy.contains('Assinar plano').click()
      })
  
      cy.get('.swal2-confirm').click()
  
      // Wait for the request to complete
      cy.wait('@subscribeRequest')
  
      // Check if success message is displayed
      cy.get('.swal2-success').should('be.visible')
      cy.contains('Inscrição realizada!').should('be.visible')
    })
  
    it('handles subscription error', () => {
      // Intercept the subscription request and simulate an error
      cy.intercept('POST', 'http://localhost:5000/api/plans/subscribe', {
        statusCode: 500,
        body: 'Subscription failed',
      }).as('subscribeRequest')
  
      cy.get('#plans .u-repeater-item').first().within(() => {
        cy.contains('Assinar plano').click()
      })
  
      cy.get('.swal2-confirm').click()
  
      // Wait for the request to complete
      cy.wait('@subscribeRequest')
  
      // Check if error message is displayed
      cy.get('.swal2-error').should('be.visible')
      cy.contains('Ocorreu um erro ao tentar se inscrever no plano.').should('be.visible')
    })
  })
  
  