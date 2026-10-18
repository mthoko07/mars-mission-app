# Mars Mission Task Management App — Project Tracker

## Project Status

Current phase: Final checks before assessment submission.

| Task | Status |
|---|---|
| Confirm Node.js, npm, Git, and VS Code | Complete |
<<<<<<< HEAD
| Create docs folder | Complete |
=======
| Create documentation folder | Complete |
>>>>>>> 03c284e (fix: run Cypress with its own server, update tracker and docs, tidy config)
| Write project plan | Complete |
| Write test plan | Complete |
| Create project tracker | Complete |
| Configure Git and .gitignore | Complete |
| Configure webpack | Complete |
| Build the user interface | Complete |
| Implement task CRUD functionality | Complete |
| Implement side panel and task count | Complete |
| Implement asynchronous Mars image | Complete |
| Configure Cypress | Complete |
| Write and execute Cypress tests | Complete |
| Update README and final documentation | Complete |
<<<<<<< HEAD
| Push final code to GitHub | Complete |
| Prepare assessment submission | Complete |
=======
| Re-run all tests on the final checkout | In progress |
| Push final code to GitHub | Pending |
| Confirm the repository is accessible to the assessor | Pending |
| Prepare assessment submission | Pending |
>>>>>>> 03c284e (fix: run Cypress with its own server, update tracker and docs, tidy config)

## Development Log

| Date | Work completed |
|---|---|
| 16 October 2026 | Project plan and test plan written |
| 18 October 2026 | Application built: task create, edit and delete, sticky header, side panel with current user and task count, delete-all, localStorage persistence, asynchronous Mars image with fallback |
| 18 October 2026 | Cypress configured; 25 end-to-end tests written (TC-001 to TC-025) |
| 18 October 2026 | Jest tests written for the task store, image loader and user interface (27 tests) |
| 18 October 2026 | Test execution report and README written; Jest and Cypress runs recorded as passing |
| 18 October 2026 | Review fixes: `npm run test:e2e` now starts the dev server itself, Babel targets browsers for the bundle, duplicate test plan removed, package name aligned with the repository |

## Test Results Recorded So Far

| Tool | Tests | Passed | Failed |
|---|---:|---:|---:|
| Jest | 27 | 27 | 0 |
| Cypress | 25 | 25 | 0 |

Re-run both suites on the final checkout and update these numbers if they change.

## Risks and Considerations

- The supplied Mars image URL is a webpage, not a direct image file. The app uses the photo's Unsplash download link instead; if it fails to load, the app shows a fallback message.
- Image loading depends on network availability. Test TC-010 uses the real image and needs internet; TC-019 covers the failure case.
- Task data should remain available after refreshing the page (covered by TC-007, TC-012 and TC-018).
- Automated tests must use predictable test data.
- The final repository should include the necessary files and exclude generated dependencies.
