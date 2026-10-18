
describe("Mars Mission application", () => {
  it("loads the main application interface", () => {
    cy.visit("/");
    cy.get("body").should("be.visible");
  });
});
