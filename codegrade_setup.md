# Codegrade Setup

This is the solution repo for [Authentication and Testing](https://github.com/BloomInstituteOfTechnology/web-sprint-challenge-authentication-and-testing) Sprint Challenge Submission.

Whenever setting up a Codegrade assignment or importing settings from another assignment:

1. Make sure that rubrics, fixtures and scripts match the ones in **this repo**.
2. Re-upload to Codegrade any items that don't match exactly the ones in this repo.
3. Run tests locally, and push an empty commit to Codegrade to verify that this repo passes all tests.

## 1- Fixtures

### Non-Student-Facing

- [codegrade_mvp.test.js](./codegrade_mvp.test.js)

## 2- Global Setup Script

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs; cg-jest install; npm i -g jest@27.5.1
```

## 3- Per-Student Setup Script

```bash
mv $FIXTURES/* . && npm install
```

## 4- Auto Tests

### Learner-Facing - Weight 10

```bash
NODE_ENV=testing cg-jest run -- api/server.test.js --runInBand --forceExit
```

### Non-Learner-Facing - Weight 90

```bash
NODE_ENV=testing cg-jest run -- codegrade_mvp.test.js --runInBand --forceExit
```

## 5- Rubric

### Auto Tests (5 points)

>Automatic tests are run against your branch, to check how closely your work matches specification.
The tests you write as part of the assignment, which can be run locally with `npm test`, will also be executed by Codegrade.
It is crucial that test your API manually using HTTPie or Postman, and troubleshoot using log statements or the debugger.
Do not rely on the automatic tests alone to check your progress!

### Introduction to Authentication

>Store passwords securely.

| Grade         | Points | Description |
|---------------|:------:|-------------|
| Not Yet       | 0      | Student does not store passwords, or stores them as plain text. |
| Met           | 1      | Student stores passwords as a hash and uses bcryptjs to verify password on login. |

### Using JSON Web Tokens (JWT)

>Implement authentication workflow.

| Grade         | Points | Description |
|---------------|:------:|-------------|
| Not Yet       | 0      | Student does not implement authentication flow or implements broken authentication. |
| Met           | 1      | Student successfully uses JSON Web Tokens to implement authentication that includes account registration and login. |

### Testing

>Write tests for the endpoints.

| Grade         | Points | Description |
|---------------|:------:|-------------|
| Not Yet       | 0      | Student does not write 2 tests for each endpoint or written tests are not functional. |
| Met           | 1      | Student writes at least 2 tests for each endpoint and tests are functional and meaningful. |

### Code Quality

>Write code that is straightforward and easy to follow.

| Grade         | Points | Description |
|---------------|:------:|-------------|
| Not Yet       | 0      | The code is difficult to read and formatted poorly. |
| Met           | 1      | The code is easy to read, properly formatted but does not use middleware functions so it could be made DRYer. |
| Flying Colors | 2      | Middleware functions are used to handle edge cases and errors, making the code very DRY. |
