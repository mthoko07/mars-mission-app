# Mars Mission Task Tracker — Test Execution Report

## 1. Overview

The Mars Mission Task Tracker is a JavaScript single-page application (SPA) developed using webpack. Automated testing was performed using Jest and Cypress to verify application functionality, task management, user interactions, and end-to-end workflows.

**Execution date:** 18 October 2026

## 2. Test Summary

| Testing tool | Test suites / specs | Tests executed | Passed | Failed |
|---|---:|---:|---:|---:|
| Jest | 3 test suites | 27 | 27 | 0 |
| Cypress | 1 spec file | 25 | 25 | 0 |
| **Total** | **4 suites/specs** | **52** | **52** | **0** |

**Overall result: PASS**

All 52 reported automated test executions passed in the latest recorded runs.

## 3. Jest Test Results

Command executed:

```bash
npm test
```

Results:

- Test suites passed: 3
- Tests passed: 27
- Tests failed: 0
- Snapshots: 0
- Overall status: PASS

Test files executed:

- `tests/store.test.js`
- `tests/image.test.js`
- `tests/ui.test.js`

These tests cover task-store behaviour, image-related functionality, and user-interface behaviour.

## 4. Cypress End-to-End Test Results

Command executed:

```bash
npm run test:e2e
```

Results from the recorded Cypress run:

- Spec files passed: 1
- Tests passed: 25
- Tests failed: 0
- Overall status: PASS

The Cypress suite covers application loading, task creation, required-field validation, task editing and deletion, current-user behaviour, and other task-management scenarios.

## 5. Defects and Fixes

During testing, the Jest test for changing the current user failed because it dispatched a `change` event while the application listens for an `input` event.

The test was corrected to dispatch the appropriate event:

```javascript
input.dispatchEvent(
  new Event('input', { bubbles: true })
);
```

The Jest suite was rerun successfully after the correction.

## 6. Conclusion

The recorded Jest and Cypress runs completed with no failing tests. The results provide automated evidence that the tested application functionality works as expected for the covered scenarios.

**Final recorded result: 52 passed, 0 failed.**

*Note: These results represent the recorded local test runs. They do not, by themselves, confirm that the same tests passed in a CI pipeline.*
