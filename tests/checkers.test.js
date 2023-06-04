const { test } = require('@playwright/test');
const CheckersPage = require('../pages/CheckersPage');

test('verify user can play and reset the game', async ({ page }) => {
    const checkersPage = new CheckersPage(page);

    // Navigate to the checkers game webpage
    await checkersPage.navigate();

    // Verify that the checkers game page is displayed
    await checkersPage.verifyCheckersPageDisplays();

    // Wait until the user can select an orange piece to move
    await checkersPage.waitForMessageToContain("Select an orange piece to move.");

    // Check that the initial number of blue checkers is 12
    await checkersPage.blueCheckerCount(12);

    // Make the first move and confirm it's successful
    await checkersPage.firstMoveChecker();
    await checkersPage.waitForMessageToContain("Make a move.");

    // Repeat for the second through fifth moves
    await checkersPage.secondMoveChecker();
    await checkersPage.waitForMessageToContain("Make a move.");

    await checkersPage.thirdMoveChecker();
    await checkersPage.waitForMessageToContain("Make a move.");

    await checkersPage.fourthMoveChecker();
    await checkersPage.waitForMessageToContain("Make a move.");

    await checkersPage.fifthMoveChecker();
    await checkersPage.waitForMessageToContain("Make a move.");

    // Confirm that one blue checker has been captured
    await checkersPage.blueCheckerCount(11);

    // Reset the game
    await checkersPage.clickReset();

    // Confirm that the reset was successful and there are 12 blue checkers again
    await checkersPage.blueCheckerCount(12);
});
