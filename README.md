# Premium SVOD Automation

## Getting started

1. Install dependencies: `yarn`
2. Run the tests: `yarn test:local` (you must have local basesite running)


### Running Tests on SauceLabs

Requires the `TEST_ENV=SAUCE` environment variable.

e.g. `SAUCE_USERNAME=<sauce_username> SAUCE_ACCESS_KEY=<sauce_access_key> TEST_ENV=SAUCE yarn test`


### Testing specific browsers

Set the "PLATFORM" and "BROWSER" environment variables


#### Some examples

* **Windows 10 IE11:** `SAUCE_USERNAME=<sauce_username> SAUCE_ACCESS_KEY=<sauce_access_key> TEST_ENV=SAUCE PLATFORM="windows" BROWSER="WIN_10_IE_11" yarn test`
* **MacOS Latest Safari:** `SAUCE_USERNAME=<sauce_username> SAUCE_ACCESS_KEY=<sauce_access_key> TEST_ENV=SAUCE PLATFORM="macos" BROWSER="CHROME_LATEST" yarn test`


#### Available platforms and browsers

These are defined in [windows.js](./features/support/utils/browsers/windows.js) and [macos.js](./features/support/utils/browsers/macos.js).

Pass the key defied in these files as the `BROWSER` environment variable.

For example: `BROWSER="WIN_10_IE_11"` and `BROWSER="CHROME_LATEST"`

##### Platforms

* "windows"
* "macos"


##### Sample cmd line args

* `SAUCE_USERNAME=$SAUCE_USERNAME SAUCE_ACCESS_KEY=$SAUCE_ACCESS_KEY TEST_ENV=SAUCE PLATFORM="windows" BROWSER="WIN_10_CHROME_LATEST" yarn test`
* `SAUCE_USERNAME=$SAUCE_USERNAME SAUCE_ACCESS_KEY=$SAUCE_ACCESS_KEY TEST_ENV=SAUCE PLATFORM="macos" BROWSER="FIREFOX_LATEST" yarn test`
* `SAUCE_USERNAME=$SAUCE_USERNAME SAUCE_ACCESS_KEY=$SAUCE_ACCESS_KEY TEST_ENV=SAUCE PLATFORM="macos" BROWSER="HIGH_SIERRA_FIREFOX" yarn test`
* `SAUCE_USERNAME=$SAUCE_USERNAME SAUCE_ACCESS_KEY=$SAUCE_ACCESS_KEY TEST_ENV=SAUCE PLATFORM="macos" BROWSER="SAFARI_12_MOJAVE" yarn test`
* `SAUCE_USERNAME=$SAUCE_USERNAME SAUCE_ACCESS_KEY=$SAUCE_ACCESS_KEY TEST_ENV=SAUCE PLATFORM="windows" BROWSER="WIN_10_IE_11" yarn test`


# Parallel Tests

Run the default gulp task: `gulp`

This will execute the tests based on your current platform (win and mac only currently) and browsers configured in `browserConfigs.js`

You can also run `gulp testWin` or `gulp testMac` for your platform.


# Executing tests on Sauce Labs

## Parallel Tests

`SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` is required in the .env file for the tests to execute on SauceLabs.

Run the `executeSauceTests` gulp task: `gulp executeSauceTests`

This will execute the tests for platforms and browsers configured in `browserConfigs.js`


# Resources

* https://github.com/cucumber/cucumber-js
* https://help.crossbrowsertesting.com/selenium-testing/frameworks/cucumber-js/
* https://www.testcookbook.com/book/javascript/cucumber-js/cucumberjs-+-selenium.html
* https://github.com/Matt-B/cucumber-js-selenium-webdriver-example
* https://github.com/SSENSE/node-cucumber-testrail-sync
* https://seleniumhq.github.io/selenium/docs/api/javascript/index.html