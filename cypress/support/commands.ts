Cypress.Commands.add('pesquisarNoBlog', (termo: string) => {
    cy.get('.astra-search-icon').first().click({ force: true });
    cy.get('#search-field').type(`${termo}{enter}`);
});