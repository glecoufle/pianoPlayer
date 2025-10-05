describe("Home page is up", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("#container", "Piano Player Sol Fa Mi Reader");
  });
});
