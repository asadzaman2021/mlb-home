import 'regenerator-runtime/runtime';
import { expect } from 'chai';
import BaseSellpage from '../../utils/pages/base-sellpage';
import { By, until, browser } from 'selenium-webdriver';
import { setDefaultTimeout, BeforeAll, Before, AfterAll, After, Given, When, Then } from 'cucumber';
import { USER_TYPES } from '../../data/user-data';

let sellPage;
let jobStatus = true;

setDefaultTimeout(60 * 1000);

// Before(function (scenario, next) {
//     const { uri, line } = scenario.sourceLocation;
//     const { name, locations, steps } = scenario.pickle;
//     const context = `"${name}" -> ${uri} -> ln. ${line}`;
//
//     sellPage = new BaseSellpage(process.env, process.env.PLATFORM, process.env.BROWSER);
//     sellPage.init().then(() => {
//         if (process.env.TEST_ENV === 'SAUCE') {
//             sellPage.driver.executeScript(`sauce:context=${context}`);
//         }
//         next();
//     });
// });
//
// AfterAll(async function () {
//     if (process.env.TEST_ENV === 'SAUCE') {
//         sellPage.driver.executeScript(`sauce:job-result=${jobStatus}`);
//     }
//
//     return;
// });
//
// After(function (scenarioResult, next) {
//     const { uri, line } = scenarioResult.sourceLocation;
//     const { name, locations, steps } = scenarioResult.pickle;
//     const { duration, status } = scenarioResult.result;
//
//     jobStatus = status === 'passed';
//
//     sellPage.driver.quit();
//     sellPage = null;
//
//     next();
// });

Given('A logged out user visits the mlb.tv sell page', async function () {
    return sellPage.visit();
});

When('The user clicks the login button', () => {
    const loginBtnSelector = 'button[aria-label="Login to your account"]';
    return sellPage.driver
        .wait(until.elementLocated(By.css(loginBtnSelector)), BaseSellpage.SLEEP_DURATION * 4)
        .then(() => {
            return sellPage.getElementByCss(loginBtnSelector);
        })
        .then((loginBtn) => {
            loginBtn.click();
        })
        .catch((error) => {
            console.log(error);
        });
});

Then('They are redirected to the mlb.tv login page', async function () {
    return sellPage.driver
        .wait(until.elementLocated(By.css('#login_login')), BaseSellpage.SLEEP_DURATION * 4)
        .then(() => {
            return sellPage.driver.getCurrentUrl();
        })
        .then((url) => {
            const startString = '.com';
            const startIndex = url.lastIndexOf(startString) + startString.length;
            const loginPath = url.substring(startIndex, url.length);
            return expect(loginPath).to.eql('/login?campaignCode=mp5&redirectUri=/tv');
        });
});
