describe('simple search', () => {
  it('should be able to perform a search in Amazon.com', () => {
    cy.visit('https://www.amazon.com');
    cy.get('[name="field-keywords"]').type('Keyboard{enter}');
  });
});
