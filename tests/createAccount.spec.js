// @ts-check
const {test, expect} = require('@playwright/test');
const {CreateAccountPage} = require('./page-object-models/createAccount.page');
const {randomUUID} = require("crypto");

const {REGISTER_PATH, EMAIL_PREFIX, EMAIL_DOMAIN, DEFAULT_TIMEOUT, SINGOUT_PATH} = require('./utils/constants');
const {generateRandomUUIDEmail} = require("./utils/generator");

test.beforeAll(async () => {
    console.log('Setting up before all tests in this file.');
});

test('Create a jobseeker account', async ({page}) => {
    const createAccountPage = new CreateAccountPage(page);

    await page.goto(REGISTER_PATH);

    const uuid = randomUUID();
    const email = EMAIL_PREFIX + uuid + EMAIL_DOMAIN

    await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123');

    await createAccountPage.createAccountButton.click();
    await expect(createAccountPage.successMessage).toBeVisible();
});

test.describe('Mandatory Form Inputs', () => {
    test('displays an error when the First name field is empty', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);
        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', '', 'Bennington', email, 'Password123');
        await createAccountPage.createAccountButton.click();

        const inputLocator = page.locator('#firstname');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please fill out this field.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the Last name field is empty', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);
        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', '', email, 'Password123');
        await createAccountPage.createAccountButton.click();

        const inputLocator = page.locator('#lastname');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please fill out this field.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the Email field is empty', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', '', 'Password123');
        await createAccountPage.createAccountButton.click();

        const inputLocator = page.locator('#emailaddress');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please fill out this field.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the Password field is empty', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);
        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, '');
        await createAccountPage.createAccountButton.click();

        const inputLocator = page.locator('#regpassword');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please fill out this field.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the Confirm password field is empty', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);
        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123', true, false);
        await createAccountPage.createAccountButton.click();

        const inputLocator = page.locator('#confirmpassword');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please fill out this field.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the Terms and Conditions checkbox is unchecked', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);
        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123', false);
        await createAccountPage.createAccountButton.click();

        const inputLocator = page.locator('#agreeTermsAndConds');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please check this box if you want to proceed.', {timeout: DEFAULT_TIMEOUT});
    });
});

test.describe('Invalid email field', () => {
    test('displays an error when the email is missing "@"', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = "invalid_email"
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123', false);
        await createAccountPage.createAccountButton.click();

        const inputLocator = page.locator('#emailaddress');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please include an \'@\' in the email address. \'invalid_email\' is missing an \'@\'.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the email is missing domain', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = "invalid_email@"
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123', false);
        await createAccountPage.createAccountButton.click();

        const inputLocator = page.locator('#emailaddress');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please enter a part following \'@\'. \'invalid_email@\' is incomplete.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the email is missing top-level domain', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = "invalid_email@invalid"
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123');
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
            expect(message).toContain('There is a problem, please check the details you have entered');
            expect(message).toContain('The email address you entered does not seem to be in the right format');
        });
    });
});

test.describe('Email address', () => {
    test('displays an error when the same email is entered', async ({page}) => {
        await page.goto(REGISTER_PATH);
        let createAccountPage = new CreateAccountPage(page);

        const email = generateRandomUUIDEmail()
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123');
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await expect(createAccountPage.successMessage).toBeVisible();
        await expect(createAccountPage.successMessage).toContainText('We have sent a confirmation email to ' + email);

        await page.goto(SINGOUT_PATH)

        await page.goto(REGISTER_PATH);
        createAccountPage = new CreateAccountPage(page);
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123');
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
            expect(message).toContain('There is a problem, please check the details you have entered');
            expect(message).toContain('This email address has already been registered Please sign in. Or have you forgotten your password?');
        });
    });
});

test.describe('Invalid password', () => {
    test('displays an error when the password is less than 6 characters', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, '1fail');
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
            expect(message).toContain('There is a problem, please check the details you have entered');
            expect(message).toContain('Password Requirements:');
            expect(message).toContain('must be at least 6 characters long');
        });
    });

    test('displays error when password contains just letters', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'invalidpassword');
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
            expect(message).toContain('There is a problem, please check the details you have entered');
            expect(message).toContain('Password Requirements:');
            expect(message).toContain('must contain both letters and numbers');
        });
    });

    test('displays an error when the password contains just numbers', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, '1234');
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
            expect(message).toContain('There is a problem, please check the details you have entered');
            expect(message).toContain('Password Requirements:');
            expect(message).toContain('must contain both letters and numbers');
        });
    });

    test('displays an error when the password is the same as first name', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Tester');
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
            expect(message).toContain('There is a problem, please check the details you have entered');
            expect(message).toContain('Password Requirements:');
            expect(message).toContain('must be different from email address, first name and last name');
        });
    });

    test('displays an error when the password is the same as last name', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = generateRandomUUIDEmail();
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Bennington');
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
            expect(message).toContain('There is a problem, please check the details you have entered');
            expect(message).toContain('Password Requirements:');
            expect(message).toContain('must be different from email address, first name and last name');
        });
    });

    test('displays an error when the password is the same as email', async ({page}) => {
        await page.goto(REGISTER_PATH);
        const createAccountPage = new CreateAccountPage(page);

        const email = "same@invalid.com"
        await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, email);
        await createAccountPage.createAccountButton.click();
        await page.waitForLoadState('load');

        await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
            expect(message).toContain('There is a problem, please check the details you have entered');
            expect(message).toContain('Password Requirements:');
            expect(message).toContain('must be at least 6 characters long');
            expect(message).toContain('must contain both letters and numbers');
            expect(message).toContain('must be different from email address, first name and last name');
        });
    });

    test.describe('Password confirmation', () => {
        test('displays an error when the confirm password does not match password', async ({page}) => {
            await page.goto(REGISTER_PATH);
            const createAccountPage = new CreateAccountPage(page);

            const email = generateRandomUUIDEmail();
            await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, 'Password123');
            await createAccountPage.confirmPassword.fill('Password1234');

            await createAccountPage.createAccountButton.click();
            await page.waitForLoadState('load');

            await createAccountPage.extractCreateAccountErrorMessageContent('#message').then((message) => {
                expect(message).toContain('There is a problem, please check the details you have entered');
                expect(message).toContain('Please confirm your new password');
            });
        });
    })
})



