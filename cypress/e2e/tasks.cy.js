
describe("Mars Mission application", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it("TC-001: loads the main application interface", () => {
    cy.get('[data-testid="header"]')
      .should("be.visible")
      .and("contain", "Houston, We Have a To-Do List");

    cy.get('[data-testid="task-form"]').should("be.visible");
    cy.get('[data-testid="task-list"]').should("be.visible");
  });

  it("TC-002: creates and displays a valid task", () => {
    cy.get('[data-testid="title-input"]')
      .type("Prepare Mars equipment");

    cy.get('[data-testid="desc-input"]')
      .type("Check oxygen supplies before launch");

    cy.get('[data-testid="assignee-input"]')
      .type("Alex");

    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]')
      .should("have.length", 1)
      .first()
      .within(() => {
        cy.get(".task__title")
          .should("have.text", "Prepare Mars equipment");

        cy.get(".task__desc")
          .should("contain.text", "Check oxygen supplies before launch");

        cy.contains("Assigned to Alex").should("be.visible");
      });

    cy.get('[data-testid="task-count"]').should("have.text", "1");
  });

  it("TC-003: prevents creating a task without a title", () => {
    cy.get('[data-testid="task-form"]').should("be.visible");

    cy.get('[data-testid="desc-input"]')
      .type("Check oxygen supplies");

    cy.get('[data-testid="assignee-input"]')
      .type("Alex");

    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="form-error"]')
      .should("be.visible")
      .and("contain.text", "A task needs a title");

    cy.get('[data-testid="task-item"]').should("not.exist");
    cy.get('[data-testid="task-count"]').should("have.text", "0");
  });
});
