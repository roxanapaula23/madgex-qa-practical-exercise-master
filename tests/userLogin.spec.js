const {test, expect} = require('@playwright/test');
const {UserLoginPage} = require('../page-object-models/userLogin.page');
const {CreateAccountPage} = require('../page-object-models/createAccount.page');
const {generateRandomUUIDEmail} = require('../utils/generator');
const {REGISTER_PATH, SIGN_OUT_PATH, DEFAULT_TIMEOUT} = require('../utils/constants');

async function registerUser(page, createAccountPage, email, password) {
    await page.goto(REGISTER_PATH);
    await createAccountPage.fillCreateAccountForm('Mr', 'Tester', 'Bennington', email, password);
    await createAccountPage.createAccountButton.click();
    await page.waitForLoadState('load');
    await expect(createAccountPage.successMessage).toBeVisible();
    await page.goto(SIGN_OUT_PATH);
}

test('User should be able to register, sign out, and then log in with a randomly generated email and a fixed password', async ({page}) => {
    const createAccountPage = new CreateAccountPage(page);
    const userLoginPage = new UserLoginPage(page);

    const randomEmail = generateRandomUUIDEmail();
    const password = 'Password123';

    await registerUser(page, createAccountPage, randomEmail, password);
    await page.goto(REGISTER_PATH);
    await userLoginPage.fillSignInForm(randomEmail, password);
    await userLoginPage.signInButton.click();
});

test.describe('Mandatory Form Inputs', () => {
    test('displays an error when the email address is empty', async ({page}) => {
        const userLoginPage = new UserLoginPage(page);
        const password = 'Password123';

        await page.goto(REGISTER_PATH);
        await userLoginPage.fillSignInForm('', password);
        await userLoginPage.signInButton.click();

        const inputLocator = page.locator('#signinemail');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please fill out this field.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the password is empty', async ({page}) => {
        const userLoginPage = new UserLoginPage(page);
        const randomEmail = generateRandomUUIDEmail();

        await page.goto(REGISTER_PATH);
        await userLoginPage.fillSignInForm(randomEmail, '');
        await userLoginPage.signInButton.click();

        const inputLocator = page.locator('#signinpassword');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please fill out this field.', {timeout: DEFAULT_TIMEOUT});
    });
});

test.describe('Email address', () => {
    test('displays an error when the email is missing "@"', async ({page}) => {
        const userLoginPage = new UserLoginPage(page);
        const invalidEmail = 'invalid.email';
        const password = 'Password123';

        await page.goto(REGISTER_PATH);
        await userLoginPage.fillSignInForm(invalidEmail, password);
        await userLoginPage.signInButton.click();

        const inputLocator = page.locator('#signinemail');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please include an \'@\' in the email address. \'invalid.email\' is missing an \'@\'.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the email is missing domain', async ({page}) => {
        const userLoginPage = new UserLoginPage(page);
        const invalidEmail = 'invalid.email@';
        const password = 'Password123';

        await page.goto(REGISTER_PATH);
        await userLoginPage.fillSignInForm(invalidEmail, password);
        await userLoginPage.signInButton.click();

        const inputLocator = page.locator('#signinemail');
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please enter a part following \'@\'. \'invalid.email@\' is incomplete.', {timeout: DEFAULT_TIMEOUT});
    });

    test('displays an error when the email is missing top-level domain', async ({page}) => {
        const userLoginPage = new UserLoginPage(page);
        const invalidEmail = 'invalid.email@invalid';
        const password = 'Password123';

        await page.goto(REGISTER_PATH);
        await userLoginPage.fillSignInForm(invalidEmail, password);
        await userLoginPage.signInButton.click();

        await userLoginPage.extractUserLoginErrorMessageContent('#message').then((message) => {
            expect(message).toContain('You have entered an incorrect username or password.');
        });
    });
});

test('Invalid password displays an error when the password is wrong', async ({page}) => {
    const createAccountPage = new CreateAccountPage(page);
    const userLoginPage = new UserLoginPage(page);

    const randomEmail = generateRandomUUIDEmail();
    const correctPassword = 'Password123';
    const wrongPassword = 'WrongPassword123';

    await registerUser(page, createAccountPage, randomEmail, correctPassword);
    await page.goto(REGISTER_PATH);
    await userLoginPage.fillSignInForm(randomEmail, wrongPassword);
    await userLoginPage.signInButton.click();
    await page.waitForSelector('#message');

    const message = await userLoginPage.extractUserLoginErrorMessageContent('#message');
    if (message.includes('Your account has been temporarily locked')) {
        expect(message).toContain('Your account has been temporarily locked. Try again in a few seconds.');
    } else {
        expect(message).toContain('You have entered an incorrect username or password.');
    }
});

test('Account lockout displays an error when the account is temporarily locked after multiple failed login attempts', async ({page}) => {
    const userLoginPage = new UserLoginPage(page);
    const unregisteredEmail = 'unregistered@example.com';
    const password = 'P@ssword123!';

    await page.goto(REGISTER_PATH);
    await userLoginPage.fillSignInForm(unregisteredEmail, password);
    await userLoginPage.signInButton.click();
    await userLoginPage.fillSignInForm(unregisteredEmail, password);
    await userLoginPage.signInButton.click();

    await userLoginPage.extractUserLoginErrorMessageContent('#message').then((message) => {
        expect(message).toContain('Your account has been temporarily locked. Try again in a few seconds.');
    });
});