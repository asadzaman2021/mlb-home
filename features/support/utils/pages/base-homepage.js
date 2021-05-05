import { By, until, browser } from 'selenium-webdriver';
import DriverFactory from '../webdriver-factory';
import { USER_TYPES, userLogins } from '../../data/user-data';

class BasePlayerPage {
    constructor(env, platform, browser, pageUrl = '/tv') {
        this.env = env;
        this.derivedEnv = 'local';
        this.platform = platform;
        this.browser = browser;
        this.url = this.getUrl(env.ENV, pageUrl);
        this.driver = null;
    }

    async getUrl(env, pageUrl) {
        let environment;
        switch (env) {
            case 'local': {
                environment = 'http://local.mlb.com:3000';
                this.derivedEnv = 'npd';
                break;
            }
            case 'development': {
                environment = 'https://dev-gcp.mlb.com';
                this.derivedEnv = 'prod';
                break;
            }
            case 'qa': {
                environment = 'https://qa-gcp.mlb.com';

                this.derivedEnv = 'npd';
                break;
            }
            case 'beta': {
                environment = 'https://beta-user:beta@mlb.com@beta-gcp.mlb.com';
                this.derivedEnv = 'prod';
                break;
            }
            default: {
                environment = 'https://www.mlb.com';
                this.derivedEnv = 'prod';
            }
        }
        return `${environment}${pageUrl}`;
    }

    async init() {
        this.driver = await DriverFactory.getDriver(this.env, this.platform, this.browser);

        return this;
    }

    async visit() {
        const url = await this.url;
        console.log(url);
        return this.driver.get(url);
    }

    getUser(entitled = true, type = USER_TYPES.MLBALL) {
        const environment = this.derivedEnv === 'test' ? 'npd' : 'prod';
        const entitlement = entitled ? 'entitled' : 'unentitled';
        return userLogins[entitlement][environment][type];
    }

    getEntitledUser(type) {
        return this.getUser(true, type);
    }

    getUnentitledUser(type) {
        return this.getUser(false, type);
    }

    getElementByName(name) {
        return this.driver
            .wait(until.elementLocated(By.css(name), BasePlayerPage.SLEEP_DURATION))
            .catch((error) => {
                console.log(`error finding element with name "${name}"`);
                return null;
            });
    }

    getElementById(id) {
        return this.driver
            .wait(until.elementLocated(By.id(id), BasePlayerPage.SLEEP_DURATION))
            .catch((error) => {
                console.log(`error finding element with ID "${id}"`);
                return null;
            });
    }

    getElementByXpath(xpath) {
        return this.driver
            .wait(until.elementLocated(By.xpath(xpath), BasePlayerPage.SLEEP_DURATION))
            .catch((error) => {
                console.log(`error finding element with xpath "${xpath}"`);
                return null;
            });
    }

    getElementByClassName(className) {
        return this.driver
            .wait(until.elementLocated(By.css(className), BasePlayerPage.SLEEP_DURATION))
            .catch((error) => {
                console.log(`error finding element by class "${className}"`);
                return null;
            });
    }

    logUserIn(user) {
        return this.driver
            .get(this.getUrl(this.env, '/tv'))
            .then(() => {
                this.driver.findElement(By.xpath('//*[@class="header__nav-top__nav-item__text" and text()="Sign In"]')).click();
                this.driver.findElement(By.xpath('//*[@class="header__nav-top__nav-item__text" and text()="Sign In"]')).click();
            })
            .then(() => {
                return this.driver.wait(
                    until.elementLocated(By.id('okta-signin-username')),
                    BasePlayerPage.SLEEP_DURATION,
                );
            })
            .then((usernameEl) => {
                usernameEl.sendKeys(user.username);
                return this.driver.findElement(By.id('okta-signin-password'));
            })
            .then((passwordEl) => {
                passwordEl.sendKeys(user.password);
                return this.driver.findElement(By.id('okta-signin-submit'));
            })
            .then((submitBtn) => {
                submitBtn.click();
            })
            .then(() => {
                this.driver.sleep(2000);
            });

    }
}

BasePlayerPage.SLEEP_DURATION = 3000;

export default BasePlayerPage;
