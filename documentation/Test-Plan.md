# Mars Mission Task Management App — Test Plan

## 1. Purpose

Verify that the Mars Mission application meets its functional requirements and that its main user journeys work reliably.

## 2. Scope

Testing covers task management, input validation, task counts, task persistence, the side panel, the sticky header, asynchronous image loading, and the delete-all operation.

## 3. Testing Types

- Functional testing
- Positive and negative testing
- Input validation testing
- Regression testing
- End-to-end browser automation using Cypress
- Manual exploratory testing

## 4. Test Environment

- Operating system: Windows
- Runtime: Node.js
- Package manager: npm
- Bundler and development server: webpack
- Automation framework: Cypress
- Browser: Chrome, where supported
- Persistence: browser localStorage

## 5. Initial Test Scenarios

| ID | Test scenario | Expected result |
|---|---|---|
| TC-001 | Open the application | Main interface loads |
| TC-002 | Create a valid task | Task appears in the task list |
| TC-003 | Submit a task with missing required fields | Validation prevents invalid submission |
| TC-004 | Edit an existing task | Updated information is displayed |
| TC-005 | Delete one task | Only the selected task is removed |
| TC-006 | Check task count | Count matches the displayed tasks |
| TC-007 | Refresh the page | Saved tasks remain available |
| TC-008 | Delete all tasks | All tasks are removed |
| TC-009 | Check the header while scrolling | Header remains visible |
| TC-010 | Load the Mars image | Image displays when loading succeeds |
| TC-011 | Check the current-user panel | Current user is displayed |
| TC-012 | Reload after deleting all tasks | Deleted tasks do not return |

## 6. Test Data

Use sample tasks with different titles, descriptions, creator names, and assignee names. Include missing fields, whitespace-only values, duplicate titles, and multiple tasks to evaluate validation and task-count behaviour.

## 7. Execution and Defect Management

Automated tests will be written and executed with Cypress. Failures will be investigated, defects corrected, and affected tests rerun. Actual test results will be recorded after execution.

## 8. Entry Criteria

- Project dependencies are installed.
- The application can start using webpack.
- The main interface is available in the browser.

## 9. Exit Criteria

- Required test scenarios have been executed.
- Failures have been investigated and documented.
- Critical functional defects have been resolved.
- Final test results are recorded before submission.