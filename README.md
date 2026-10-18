# Mars Mission Task Tracker 🚀

A JavaScript single-page application (SPA) built for the Mars Mission technical assessment. The application allows mission team members to manage tasks, track assignments, and monitor task activity.

## Features

- **Task management:** Create, view, edit, and delete tasks.
- **Task details:** Each task contains a title, description, creator, and assignee.
- **Sticky header:** A coloured Mars-themed header remains visible while scrolling.
- **Current user:** Displays and allows updating the current user.
- **Task counter:** Displays the number of tasks currently stored.
- **Delete all tasks:** Removes all tasks through a confirmation prompt.
- **Data persistence:** Tasks and the current user remain saved after refreshing the page.
- **Mars image:** Loads the Mars image asynchronously and displays a fallback if loading fails.

## Technologies Used

- JavaScript
- HTML5 and CSS3
- Webpack 5
- Jest
- Cypress
- Node.js and npm
- Git and GitHub

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/) (optional if downloading the repository as a ZIP file)

## Installation

Clone the repository:

```bash
git clone https://github.com/mthoko07/mars-mission-app.git
cd mars-mission-app
```

Install the project dependencies:

```bash
npm install
```

## Run the Application

Start the development server:

```bash
npm start
```

The development server opens the application in your browser. If it does not open automatically, visit:

http://localhost:3000/

If port 3000 is already in use, stop the existing development server or use an available port.

## Production Build

Compile and bundle the application using webpack:

```bash
npm run build
```

Webpack generates the production build in the `dist` directory.

## Automated Testing

This project uses Jest and Cypress for complementary levels of automated testing.

### Jest — Unit and UI Tests

Run the Jest test suite:

```bash
npm test
```

Recorded test results:

- Test suites passed: 3
- Tests passed: 27
- Tests failed: 0

Test files:

- `tests/store.test.js`
- `tests/image.test.js`
- `tests/ui.test.js`

### Cypress — End-to-End Tests

Run the Cypress tests in headless mode:

```bash
npm run test:e2e
```

Recorded test results:

- Spec files passed: 1
- Tests passed: 25
- Tests failed: 0

The Cypress suite covers application loading, task creation and editing, validation, deletion, persistence, the sticky header, current-user behaviour, and image-loading scenarios.

### Combined Test Results

The latest recorded runs reported **52 passing automated test executions**:

| Tool | Passed | Failed |
|---|---:|---:|
| Jest | 27 | 0 |
| Cypress | 25 | 0 |
| **Total** | **52** | **0** |

These results reflect the recorded local test runs; rerun the suites to verify the current checkout.

## Project Structure

```text
mars-mission-app/
├── cypress/
│   └── e2e/
├── documentation/
├── src/
├── tests/
├── .gitignore
├── cypress.config.js
├── package.json
├── package-lock.json
├── webpack.config.js
└── README.md
```

## Repository

GitHub: https://github.com/mthoko07/mars-mission-app

## Assessment

Developed as part of the JavaScript Test Automation Developer technical assessment. The project demonstrates JavaScript SPA development, webpack bundling, task management functionality, automated testing with Jest and Cypress, and version control using Git.