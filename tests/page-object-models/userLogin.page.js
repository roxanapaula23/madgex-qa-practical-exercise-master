const {expect} = require('@playwright/test');
exports.UserLoginPage = class UserLoginPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.email = page.getByRole('group', {name: 'Sign in'}).getByLabel('Email address Required', {exact: true});
        this.password = page.getByRole('group', {name: 'Sign in'}).getByLabel('Password Required', {exact: true});
        this.signInButton = page.getByRole('group', {name: 'Sign in'}).getByRole('button', {name: 'Sign in'});
    }

    async fillSignInForm(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
    }

    async extractUserLoginErrorMessageContent(selectorId) {
        const element = this.page.locator(selectorId);
        return await element.evaluate((element) => element.textContent);
    }
}