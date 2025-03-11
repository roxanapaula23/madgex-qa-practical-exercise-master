exports.JobAlertsPage = class JobAlertsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('input[type="email"][id="emailaddress"]');
        this.keywordsInput = page.locator('input[name="Keywords"]');
        this.locationInput = page.locator('input[name="radialtown"]');
        this.workingFromHomeCheckbox = page.locator('input[name="LocationId"][value="20752010"]');
        this.itCheckbox = page.locator('input[name="Industry"][value="19"]');
        this.salaryCheckbox = page.locator('input[name="SalaryRange"][value="178"]');
        this.moreOptionsButton = page.locator('button.js-accordion-trigger[aria-expanded="false"]');
        this.permanentJobCheckbox = page.locator('input#JobType-186');
        this.contractJobCheckbox = page.locator('input#JobType-187');
        this.fullTimeCheckbox = page.locator('input#Hours-191');
        this.directEmployerCheckbox = page.locator('input#employertype--10')
        this.frequencySelect = page.locator('select#Frequency');
        this.dayOfWeekSelect = page.locator('select#DayOfWeekToSendOn');
        this.submitButton = page.locator('input[type="submit"][value="Email me jobs like this"]');
        this.successMessage = page.locator('p.message.message--success[role="alert"]');
    }

    async fillDetails(email, keywords, location) {
        await this.emailInput.fill(email);
        await this.keywordsInput.fill(keywords);
        await this.locationInput.fill(location);
    }

    async checkGeneralOptions() {
        await this.workingFromHomeCheckbox.check();
        await this.workingFromHomeCheckbox.check();
        await this.itCheckbox.check();
        await this.salaryCheckbox.check();
    }

    async performClickAction(action) {
        switch (action) {
            case 'expandMoreOptions':
                await this.moreOptionsButton.click();
                break;
            case 'submitForm':
                await this.submitButton.click();
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    async checkMoreOptions() {
        await this.permanentJobCheckbox.check();
        await this.contractJobCheckbox.check();
        await this.fullTimeCheckbox.check();
        await this.directEmployerCheckbox.check();
    }

    async selectPreferences(frequency, day) {
        await this.frequencySelect.selectOption(frequency);
        await this.dayOfWeekSelect.selectOption(day);
    }

    async extractMessage(type, selector) {
        switch (type) {
            case 'success':
                return this.successMessage.textContent();
            case 'error':
                return await this.page.locator(selector).textContent();
            default:
                return null
        }
    }
}