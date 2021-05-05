import { By, until, browser } from 'selenium-webdriver';
import DriverFactory from '../webdriver-factory';
import { USER_TYPES, userLogins } from '../../data/user-data';

class BaseSellPage {
    constructor(env, platform, browser, pageUrl = '/live-stream-games/subscribe') {
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

    getElementByCss(selector) {
        return this.driver
            .wait(until.elementLocated(By.css(selector), BaseSellPage.SLEEP_DURATION))
            .catch((error) => {
                console.log(`error finding element with selector "${selector}"`);
                return null;
            });
    }
}

BaseSellPage.SLEEP_DURATION = 3000;

export default BaseSellPage;
