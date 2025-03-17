# QA Automation Project

This project is designed for automated testing using Playwright and JavaScript. The test suite covers key functionalities, including jobseeker account creation, job alerts, and user login. Tests are executed against AmericaJobboard.com to ensure reliability and compliance with expected behaviors.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for testing purposes.

### Prerequisites
Before going further make sure that you have this tool installed on your machine:
    
- Node.js

### Cloning

First, clone the repository to your local machine:
```sh
  https://github.com/roxanapaula23/madgex-qa-practical-exercise-master.git
```
Access the project:
```sh
  cd madgex-qa-practical-exercise-master
```

### Installation

Install dependencies:
```sh
  npm install
```

Install Playwright and required browsers:
```sh
  npx playwright install
```

### Testing

Run the tests:
```sh
  npx playwright test
```

### Reporting
After running `npx playwright test` you can check the reports by running: 
```sh
  npx playwright show-report
```

