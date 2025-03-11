const {expect} = require('@playwright/test');
const {randomUUID} = require('crypto');

exports.CreateAccountPage = class CreateAccountPage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.title = page.getByRole('textbox', {name: 'title'});
        this.firstName = page.getByLabel('First name Required');
        this.lastName = page.getByLabel('Last name Required');
        this.email = page.getByRole('group', {name: 'Create an account'}).getByLabel('Email address Required');
        this.password = page.getByRole('group', {name: 'Create an account'}).getByLabel('Password Required', {exact: true});
        this.confirmPassword = page.getByLabel('Confirm password Required');
        this.termsAndConditions = page.getByLabel('I agree to the Terms &');
        this.createAccountButton = page.getByRole('button', {name: 'Create an account'});
        this.successMessage = page.getByText('We have sent a confirmation')
    }

    async fillCreateAccountForm(title, userFirstName, userLastName, email, password, termsAndConditions = true, confirmPassword = true) {
        await this.title.fill(title);
        await this.firstName.fill(userFirstName);
        await this.lastName.fill(userLastName);
        await this.email.fill(email);
        await this.password.fill(password);

        confirmPassword ? await this.confirmPassword.fill(password) : await this.confirmPassword.fill('');
        termsAndConditions ? await this.termsAndConditions.check() : await this.termsAndConditions.uncheck();
    }

    async extractCreateAccountErrorMessageContent(selectorId) {
        const element = this.page.locator(selectorId);
        return await element.evaluate((element) => element.textContent);
    }
};
