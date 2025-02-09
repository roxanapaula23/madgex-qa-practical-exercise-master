# QA Practical Exercise

This project is intended to be the starting point for a practical exercise. The project uses Playwright and Javascript. I've written one test that tests jobseeker account creation. Prospective candidates will be asked to add more tests that cover the validation of the account creation form. Currently the test runs against AmericaJobboard.com.

# Prerequisites

You will need to install Node 22 or later and install Node package manager (npm). This excercise been tested with node 22. You should be able to download it from https://nodejs.org/en/download NPM should be included by default.

# How to setup and run the test

To run the tests simply `npm install` to install everything then run `npx playwright install` to install the browsers and finally run `npx playwright tests` to run the tests.

The tests currently run against AmericaJobboard.com

# The Scenario 

The developers are creating an account sign up page and have recently added validation to the account creation form.  

We need to add tests to cover the validation on the account creation form. 

We’d like you to take up the reins and progress the the test suite as much as you feel is enough to demonstrate your abilities. As a guide we’d allow 1-2 hours for this exercise, we’re not so much concerned with a ‘finished’ project, more a strong indication as to how you’ve tackled what you aimed to achieve.

# Show report
After running `npx playwright tests` you can check the reports by running: 
```sh
  npx playwright show-report
```

# Bugs

- **Password reset redirection after Account Creation**

- **User remains logged in even when 'Keep me signed in' checkbox is unchecked**

- **Incorrect generic error message for Mismatched Passwords**
