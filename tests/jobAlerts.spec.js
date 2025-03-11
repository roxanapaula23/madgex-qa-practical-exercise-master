const {test, expect} = require('@playwright/test');
const {JobAlertsPage} = require('../page-object-models/jobAlerts.page');
const {JOB_ALERTS_PATH, DEFAULT_TIMEOUT} = require('../utils/constants');

test.describe('Job Alerts', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(JOB_ALERTS_PATH);
    });

    test('Create a job alert for Software Tester', async ({page}) => {
        const jobAlertsPage = new JobAlertsPage(page);

        await jobAlertsPage.fillDetails('roxanaqa@yopmail.com', 'software tester', 'Romania');
        await jobAlertsPage.checkGeneralOptions();
        await jobAlertsPage.performClickAction('expandMoreOptions');
        await jobAlertsPage.checkMoreOptions();
        await jobAlertsPage.selectPreferences('Weekly', 'Monday');
        await jobAlertsPage.performClickAction('submitForm');

        const successMessage = await jobAlertsPage.extractMessage('success', 'p.message.message--success[role="alert"]');
        await expect(successMessage).toBe('Your new job alert has been set up successfully');
    });

    test.describe('Invalid email field', () => {
        test('displays an error when the email is missing "@"', async ({page}) => {
            const jobAlertsPage = new JobAlertsPage(page);
            const email = 'invalid_email';

            await jobAlertsPage.fillDetails(email, 'software tester', 'Romania');
            await jobAlertsPage.performClickAction('submitForm');

            const inputLocator = jobAlertsPage.emailInput;
            await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please include an \'@\' in the email address. \'invalid_email\' is missing an \'@\'.', {timeout: DEFAULT_TIMEOUT});
        });

        test('displays an error when the email is missing domain', async ({page}) => {
            const jobAlertsPage = new JobAlertsPage(page);
            const email = 'invalid_email@';

            await jobAlertsPage.fillDetails(email, 'software tester', 'Romania');
            await jobAlertsPage.performClickAction('submitForm');

            const inputLocator = jobAlertsPage.emailInput;
            await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please enter a part following \'@\'. \'invalid_email@\' is incomplete.', {timeout: DEFAULT_TIMEOUT});
        });

        test('displays an error when the email is missing top-level domain', async ({page}) => {
            const jobAlertsPage = new JobAlertsPage(page);
            const email = "invalid_email@gmail";

            await jobAlertsPage.fillDetails(email, 'software tester', 'Romania');
            await jobAlertsPage.performClickAction('submitForm');

            const errorMessage1 = (await jobAlertsPage.extractMessage('error', '#message')).trim();
            await expect(errorMessage1).toBe('There is a problem. Please check the details you have entered');

            const errorMessage2 = (await jobAlertsPage.extractMessage('error', '.error-text.margin-bottom-5')).trim();
            await expect(errorMessage2).toBe('The email address you entered does not seem to be in the right format');
        });
    });

    test('Mandatory input displays an error when the email field is empty', async ({page}) => {
        const jobAlertsPage = new JobAlertsPage(page);

        await jobAlertsPage.fillDetails('', 'software tester', 'Romania');
        await jobAlertsPage.performClickAction('submitForm');

        const inputLocator = jobAlertsPage.emailInput;
        await expect(inputLocator).toHaveJSProperty('validationMessage', 'Please fill out this field.', {timeout: DEFAULT_TIMEOUT});
    });
});
