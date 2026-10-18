
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

  
  it("TC-004: updates an existing task", () => {
    cy.get('[data-testid="title-input"]')
      .type("Prepare Mars equipment");

    cy.get('[data-testid="desc-input"]')
      .type("Check oxygen supplies");

    cy.get('[data-testid="assignee-input"]')
      .type("Alex");

    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]')
      .should("have.length", 1);

    cy.get('[data-testid="edit-task"]').click();

    cy.get('[data-testid="title-input"]')
      .should("have.value", "Prepare Mars equipment")
      .clear()
      .type("Inspect Mars rover");

    cy.get('[data-testid="desc-input"]')
      .clear()
      .type("Inspect wheels and navigation systems");

    cy.get('[data-testid="assignee-input"]')
      .clear()
      .type("Sam");

    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]')
      .should("have.length", 1)
      .first()
      .within(() => {
        cy.get(".task__title")
          .should("have.text", "Inspect Mars rover");

        cy.get(".task__desc")
          .should("contain.text", "Inspect wheels and navigation systems");

        cy.contains("Assigned to Sam").should("be.visible");
      });

    cy.get('[data-testid="task-count"]').should("have.text", "1");
  });

  
  it("TC-005: deletes one task without deleting other tasks", () => {
    // Create the first task
    cy.get('[data-testid="title-input"]')
      .type("Check oxygen supplies");
    cy.get('[data-testid="submit-task"]').click();

    // Create the second task
    cy.get('[data-testid="title-input"]')
      .clear()
      .type("Inspect the rover");
    cy.get('[data-testid="submit-task"]').click();

    // Confirm both tasks exist
    cy.get('[data-testid="task-item"]').should("have.length", 2);

    // Delete the first task
    cy.get('[data-testid="task-item"]')
      .contains(".task__title", "Check oxygen supplies")
      .parents('[data-testid="task-item"]')
      .find('[data-testid="delete-task"]')
      .click();

    // Confirm only the second task remains
    cy.get('[data-testid="task-item"]')
      .should("have.length", 1)
      .within(() => {
        cy.get(".task__title")
          .should("have.text", "Inspect the rover");
      });

    cy.get('[data-testid="task-count"]').should("have.text", "1");
  });
 
  it("TC-006: updates the task count when tasks are created and deleted", () => {
    // Starts at zero
    cy.get('[data-testid="task-count"]').should("have.text", "0");

    // Create the first task
    cy.get('[data-testid="title-input"]').type("Test oxygen system");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-count"]').should("have.text", "1");

    // Create the second task
    cy.get('[data-testid="title-input"]').type("Inspect rover");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-count"]').should("have.text", "2");

    // Delete one task
    cy.get('[data-testid="task-item"]')
      .contains(".task__title", "Test oxygen system")
      .parents('[data-testid="task-item"]')
      .find('[data-testid="delete-task"]')
      .click();

    cy.get('[data-testid="task-count"]').should("have.text", "1");
  });

  //Verify tasks persist after refreshing
  it("TC-007: keeps saved tasks after refreshing the page", () => {
    cy.get('[data-testid="title-input"]').type("Prepare the Mars rover");
    cy.get('[data-testid="desc-input"]').type("Check wheels and navigation");
    cy.get('[data-testid="assignee-input"]').type("Alex");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]').should("have.length", 1);

    cy.reload();

    cy.get('[data-testid="task-item"]').should("have.length", 1).within(() => {
      cy.get(".task__title").should("have.text", "Prepare the Mars rover");
      cy.get(".task__desc").should("contain.text", "Check wheels and navigation");
      cy.contains("Assigned to Alex").should("be.visible");
    });

    cy.get('[data-testid="task-count"]').should("have.text", "1");
  });

  
  it("TC-008: deletes all tasks successfully", () => {
    cy.get('[data-testid="title-input"]').type("Prepare the rover");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="title-input"]').clear().type("Check oxygen supplies");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]').should("have.length", 2);
    cy.get('[data-testid="task-count"]').should("have.text", "2");

    cy.on("window:confirm", () => true);
    cy.get('[data-testid="delete-all"]').click();

    cy.get('[data-testid="task-item"]').should("not.exist");
    cy.get('[data-testid="task-count"]').should("have.text", "0");
  });

  it("TC-009: keeps the header visible while scrolling", () => {
    // Create enough tasks to make the page scrollable.
    for (let i = 1; i <= 10; i++) {
      cy.get('[data-testid="title-input"]').clear().type(`Mission task ${i}`);
      cy.get('[data-testid="submit-task"]').click();
    }

    cy.get('[data-testid="task-item"]').should("have.length", 10);

    // Scroll down the page.
    cy.scrollTo("bottom");

    // Confirm the sticky header remains visible.
    cy.get('[data-testid="header"]')
      .should("be.visible")
      .and("contain", "Houston, We Have a To-Do List");

    // Confirm the header is still positioned at the top.
    cy.get('[data-testid="header"]').then(($header) => {
      expect($header[0].getBoundingClientRect().top).to.be.closeTo(0, 2);
    });
  });

  
  // Uses the real Unsplash image, so this test needs an internet connection.
      it("TC-010: displays the Mars image when loading succeeds", () => {
       // A 1x1 PNG stands in for the Unsplash image, so this test does not need the internet.
       const png =
         "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGM46ML3HwAE8AITH90MAAAAAABJRU5ErkJggg==";
       cy.intercept("GET", "**/photos/4IrVnSpwk48/download*", {
         statusCode: 200,
         headers: { "content-type": "image/png" },
         body: Cypress.Buffer.from(png, "base64"),
       });
       cy.reload();

       cy.get('[data-testid="hero"]').should("be.visible");

       cy.get('[data-testid="hero"] img.hero__img', { timeout: 15000 })
         .should("be.visible")
         .and("have.attr", "alt", "A red planet against a black background")
         .and(($img) => {
           expect($img[0].naturalWidth).to.be.greaterThan(0);
         });

       cy.get('[data-testid="hero"]').should("have.class", "hero--loaded");
     });

  it("TC-011: displays the current user in the side panel", () => {
    cy.get('[data-testid="side-panel"]').should("be.visible");

    cy.get('[data-testid="current-user"]')
      .should("be.visible")
      .and("have.value", "Mission Commander");

    cy.get('[data-testid="task-count"]').should("have.text", "0");
  });

  it("TC-012: keeps deleted tasks removed after reloading", () => {
    cy.get('[data-testid="title-input"]').type("Prepare the launch checklist");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]').should("have.length", 1);
    cy.get('[data-testid="task-count"]').should("have.text", "1");

    cy.on("window:confirm", () => true);
    cy.get('[data-testid="delete-all"]').click();

    cy.get('[data-testid="task-item"]').should("not.exist");
    cy.get('[data-testid="task-count"]').should("have.text", "0");

    cy.reload();

    cy.get('[data-testid="task-item"]').should("not.exist");
    cy.get('[data-testid="task-count"]').should("have.text", "0");
  });

  it("TC-013: assigns Unassigned when no assignee is provided", () => {
    cy.get('[data-testid="title-input"]').type("Calibrate navigation system");
    cy.get('[data-testid="desc-input"]').type("Verify navigation before launch");

    cy.get('[data-testid="assignee-input"]').should("have.value", "");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]').should("have.length", 1).within(() => {
      cy.get(".task__title").should("have.text", "Calibrate navigation system");
      cy.contains("Assigned to Unassigned").should("be.visible");
    });

    cy.get('[data-testid="task-count"]').should("have.text", "1");
  });

  it("TC-014: rejects a title containing only whitespace", () => {
    cy.get('[data-testid="title-input"]').type("   ");
    cy.get('[data-testid="desc-input"]').type("Check the rover systems");

    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="form-error"]')
      .should("be.visible")
      .and("contain.text", "A task needs a title");

    cy.get('[data-testid="task-item"]').should("not.exist");
    cy.get('[data-testid="task-count"]').should("have.text", "0");
  });

  it("TC-015: rejects an empty title when editing a task", () => {
    cy.get('[data-testid="title-input"]').type("Prepare launch checklist");
    cy.get('[data-testid="desc-input"]').type("Verify all launch systems");
    cy.get('[data-testid="assignee-input"]').type("Alex");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="edit-task"]').click();

    cy.get('[data-testid="title-input"]').clear();
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="form-error"]')
      .should("be.visible")
      .and("contain.text", "A task needs a title");

    cy.get('[data-testid="task-item"]').should("have.length", 1).within(() => {
      cy.get(".task__title").should("have.text", "Prepare launch checklist");
      cy.get(".task__desc").should("contain.text", "Verify all launch systems");
      cy.contains("Assigned to Alex").should("be.visible");
    });

    cy.get('[data-testid="task-count"]').should("have.text", "1");
  });

  it("TC-016: keeps tasks when delete-all is cancelled", () => {
    cy.get('[data-testid="title-input"]').type("Prepare the rover");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="title-input"]').clear().type("Check oxygen supplies");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]').should("have.length", 2);
    cy.get('[data-testid="task-count"]').should("have.text", "2");

    cy.on("window:confirm", () => false);
    cy.get('[data-testid="delete-all"]').click();

    cy.get('[data-testid="task-item"]').should("have.length", 2);
    cy.get('[data-testid="task-count"]').should("have.text", "2");

    cy.contains(".task__title", "Prepare the rover").should("be.visible");
    cy.contains(".task__title", "Check oxygen supplies").should("be.visible");
  });

  it("TC-017: updates the side panel when the current user changes", () => {
    cy.get('[data-testid="current-user"]')
      .should("have.value", "Mission Commander");

    cy.get('[data-testid="current-user"]')
      .clear()
      .type("Alex Morgan");

    cy.get('[data-testid="current-user"]')
      .should("have.value", "Alex Morgan");

    cy.get('[data-testid="title-input"]').type("Inspect the rover");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]').within(() => {
      cy.contains("Created by Alex Morgan").should("be.visible");
    });
  });

  it("TC-018: persists the current user after refreshing", () => {
    cy.get('[data-testid="current-user"]')
      .clear()
      .type("Alex Morgan");

    cy.reload();

    cy.get('[data-testid="current-user"]')
      .should("be.visible")
      .and("have.value", "Alex Morgan");
  });

  it("TC-019: displays a fallback message when the Mars image fails", () => {
    cy.intercept("GET", "**/photos/4IrVnSpwk48/download*", {
      forceNetworkError: true,
    });

    cy.reload();

    cy.get('[data-testid="hero"]', { timeout: 10000 })
      .should("have.class", "hero--failed")
      .and("contain.text", "Mars is out of signal range right now.");

    cy.get('[data-testid="hero"] img.hero__img').should("not.exist");
  });

  it("TC-020: deletes only the selected task when several tasks exist", () => {
    const tasks = [
      "Prepare the rover",
      "Check oxygen supplies",
      "Inspect navigation systems",
    ];

    tasks.forEach((task) => {
      cy.get('[data-testid="title-input"]').clear().type(task);
      cy.get('[data-testid="submit-task"]').click();
    });

    cy.get('[data-testid="task-item"]').should("have.length", 3);
    cy.get('[data-testid="task-count"]').should("have.text", "3");

    cy.get('[data-testid="task-item"]')
      .contains(".task__title", "Check oxygen supplies")
      .parents('[data-testid="task-item"]')
      .find('[data-testid="delete-task"]')
      .click();

    cy.get('[data-testid="task-item"]').should("have.length", 2);
    cy.get('[data-testid="task-count"]').should("have.text", "2");

    cy.contains(".task__title", "Prepare the rover").should("be.visible");
    cy.contains(".task__title", "Inspect navigation systems").should("be.visible");
    cy.contains(".task__title", "Check oxygen supplies").should("not.exist");
  });

  it("TC-021: displays correct details for multiple tasks", () => {
    // Create the first task as Alex.
    cy.get('[data-testid="current-user"]').clear().type("Alex");
    cy.get('[data-testid="title-input"]').type("Prepare the rover");
    cy.get('[data-testid="desc-input"]').type("Inspect wheels and navigation");
    cy.get('[data-testid="assignee-input"]').type("Jordan");
    cy.get('[data-testid="submit-task"]').click();

    // Change the creator and create a second task.
    cy.get('[data-testid="current-user"]').clear().type("Sam");
    cy.get('[data-testid="title-input"]').type("Check oxygen supplies");
    cy.get('[data-testid="desc-input"]').type("Verify oxygen tanks");
    cy.get('[data-testid="assignee-input"]').type("Taylor");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]').should("have.length", 2);

    // Verify the first task's details.
    cy.get('[data-testid="task-item"]').eq(0).within(() => {
      cy.get(".task__title").should("have.text", "Prepare the rover");
      cy.get(".task__desc").should("contain.text", "Inspect wheels and navigation");
      cy.contains("Created by Alex").should("be.visible");
      cy.contains("Assigned to Jordan").should("be.visible");
    });

    // Verify the second task's details.
    cy.get('[data-testid="task-item"]').eq(1).within(() => {
      cy.get(".task__title").should("have.text", "Check oxygen supplies");
      cy.get(".task__desc").should("contain.text", "Verify oxygen tanks");
      cy.contains("Created by Sam").should("be.visible");
      cy.contains("Assigned to Taylor").should("be.visible");
    });

    cy.get('[data-testid="task-count"]').should("have.text", "2");
  });

  it("TC-022: displays the empty state when no tasks exist", () => {
    cy.get('[data-testid="task-item"]').should("not.exist");

    cy.get('[data-testid="empty-state"]')
      .should("be.visible");

    cy.get('[data-testid="task-count"]').should("have.text", "0");
  });

  it("TC-023: resets the task count to zero after deleting all tasks", () => {
    cy.get('[data-testid="title-input"]').type("Prepare the rover");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="title-input"]').clear().type("Check oxygen supplies");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="title-input"]').clear().type("Inspect navigation");
    cy.get('[data-testid="submit-task"]').click();

    cy.get('[data-testid="task-item"]').should("have.length", 3);
    cy.get('[data-testid="task-count"]').should("have.text", "3");

    cy.on("window:confirm", () => true);
    cy.get('[data-testid="delete-all"]').click();

    cy.get('[data-testid="task-item"]').should("not.exist");
    cy.get('[data-testid="task-count"]').should("have.text", "0");
    cy.get('[data-testid="empty-state"]').should("be.visible");
  });

  it("TC-024: keeps the sticky header visible when scrolling down and up", () => {
    // Create enough tasks to make the page scrollable.
    for (let i = 1; i <= 10; i++) {
      cy.get('[data-testid="title-input"]').clear().type(`Mission task ${i}`);
      cy.get('[data-testid="submit-task"]').click();
    }

    cy.get('[data-testid="task-item"]').should("have.length", 10);

    // Scroll down and check the header.
    cy.scrollTo("bottom");

    cy.get('[data-testid="header"]')
      .should("be.visible")
      .then(($header) => {
        expect($header[0].getBoundingClientRect().top).to.be.closeTo(0, 2);
      });

    // Scroll back to the top and check again.
    cy.scrollTo("top");

    cy.get('[data-testid="header"]')
      .should("be.visible")
      .then(($header) => {
        expect($header[0].getBoundingClientRect().top).to.be.closeTo(0, 2);
      });
  });

  it("TC-025: preserves original task details when editing is cancelled", () => {
    // Create a task with its original details.
    cy.get('[data-testid="title-input"]').type("Prepare the Mars rover");
    cy.get('[data-testid="desc-input"]').type("Inspect wheels before launch");
    cy.get('[data-testid="assignee-input"]').type("Alex");
    cy.get('[data-testid="submit-task"]').click();

    // Open edit mode and change the fields.
    cy.get('[data-testid="edit-task"]').click();

    cy.get('[data-testid="title-input"]')
      .clear()
      .type("Updated rover task");

    cy.get('[data-testid="desc-input"]')
      .clear()
      .type("Updated inspection details");

    cy.get('[data-testid="assignee-input"]')
      .clear()
      .type("Jordan");

    // Cancel instead of saving the changes.
    cy.get('[data-testid="cancel-edit"]').click();

    // Verify that the original details are unchanged.
    cy.get('[data-testid="task-item"]').should("have.length", 1).within(() => {
      cy.get(".task__title").should("have.text", "Prepare the Mars rover");
      cy.get(".task__desc").should("contain.text", "Inspect wheels before launch");
      cy.contains("Assigned to Alex").should("be.visible");
    });

    cy.get('[data-testid="task-count"]').should("have.text", "1");
  });


});
