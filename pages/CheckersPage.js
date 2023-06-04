const { expect } = require('@playwright/test');
const locators = require('./CheckersPageLocators');

class CheckersPage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://www.gamesforthebrain.com/game/checkers/');
    }

    async verifyCheckersPageDisplays() {
        try {
            const heading = await this.page.locator(locators.BOARD);
            await heading.isVisible();
            console.log("board displayed on the page");

            const isVisible = await heading.isVisible();
            expect(isVisible).toBe(true);
        } catch (error) {
            console.log("Error occurred while verifying if Checkers board is displayed: ", error);
        }
    }

    async waitForMessageToContain(expectedMessage, checkInterval = 5000, timeout = 60000) {
        let startTime = Date.now();

        while (true) {
            try {
                await this.page.waitForTimeout(1000);
                await this.page.waitForSelector('#message');

                // Wait for the inner text to contain expected message
                await this.page.waitForFunction(
                    (expectedMessage) => {
                        const actualMessage = document.querySelector('#message').innerText;
                        return actualMessage.includes(expectedMessage);
                    },
                    expectedMessage,
                    { timeout: checkInterval }
                );

                const actualMessage = await this.page.innerText('#message');
                expect(actualMessage).toContain(expectedMessage);
                console.log(`"#message" element contains "${expectedMessage}"`);
                break;
            } catch (error) {
                if (Date.now() - startTime > timeout) {
                    console.log(`Timeout while waiting for "#message" to contain "${expectedMessage}": `, error);
                    break;
                }
                // If message not found, wait for checkInterval time and try again
                await this.page.waitForTimeout(checkInterval);
            }
        }
    }


    async firstMoveChecker() {
        await this.page.waitForSelector(locators.FIRST_MOVE_CURRENT);
        await this.testMove(this.page, locators.FIRST_MOVE_CURRENT, locators.FIRST_MOVE_TARGET);
    }

    async secondMoveChecker() {
        await this.page.waitForSelector(locators.SECOND_MOVE_CURRENT);
        await this.testMove(this.page, locators.SECOND_MOVE_CURRENT, locators.SECOND_MOVE_TARGET);

    }

    async thirdMoveChecker() {
        await this.page.waitForSelector(locators.THIRD_MOVE_CURRENT);
        await this.testMove(this.page, locators.THIRD_MOVE_CURRENT, locators.THIRD_MOVE_TARGET);
    }

    async fourthMoveChecker() {
        await this.page.waitForSelector(locators.FOURTH_MOVE_CURRENT);
        await this.testMove(this.page, locators.FOURTH_MOVE_CURRENT, locators.FOURTH_MOVE_TARGET);
    }

    async fifthMoveChecker() {
        await this.page.waitForSelector(locators.FIFTH_MOVE_CURRENT);
        await this.testMove(this.page, locators.FIFTH_MOVE_CURRENT, locators.FIFTH_MOVE_TARGET);
    }

    async testMove(page, current, target) {
        await expect.poll(async () => {
            return await page.locator(current).getAttribute("src");
        }, { timeout: 60000 }).toContain('you1.gif');

        await page.locator(current).click();
        await page.waitForTimeout(1000);
        await expect.poll(async () => {
            return await page.locator(current).getAttribute("src");
        }, { timeout: 60000 }).toContain('you2.gif');

        await expect.poll(async () => {
            return await page.locator(target).getAttribute("src");
        }, { timeout: 60000 }).toContain('gray.gif');

        await page.locator(target).click();

        await expect.poll(async () => {
            return await page.locator(target).getAttribute("src");
        }, { timeout: 60000 }).toContain('you1.gif');
    }

    async blueCheckerCount(expectedCount) {
        const elements = await this.page.locator(locators.BLUE_CHECKER).count();
        expect(elements).toBe(expectedCount);
    }
    
    async clickReset() {
        await this.page.click(locators.RESTART_BUTTON);
    }
}

module.exports = CheckersPage;
