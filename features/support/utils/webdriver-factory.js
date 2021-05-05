import WindowsBrowsers from './browsers/windows';
import MacBrowsers from './browsers/macos';
import { Builder, Capabilities } from 'selenium-webdriver';

class WebDriverFactory {
    static getCapabilities(platform, browser) {
        let platformCapabilities = MacBrowsers;
        let capabilities;

        if (platform === WindowsBrowsers.platform) {
            platformCapabilities = WindowsBrowsers;
        }

        capabilities = platformCapabilities[browser];

        return capabilities;
    }

    static async getLocalDriver(env, platform, browser) {
        const capabilities = WebDriverFactory.getCapabilities(platform, browser);

        const driver = await new Builder().withCapabilities(capabilities).build();

        return driver;
    }

    static async getSauceDriver(env, platform, browser) {
        const defaultCapabilities = WebDriverFactory.getCapabilities(platform, browser);
        const BUILD_NUMBER = env.BUILD_NUMBER;
        const JOB_NAME = env.JOB_NAME;

        const capabilities = {
            ...defaultCapabilities,
            username: env.SAUCE_USERNAME,
            accessKey: env.SAUCE_ACCESS_KEY,
            name: `MLB.TV PREMIUM SVOD: ${JOB_NAME} - ${BUILD_NUMBER}`,
            maxInstances: 1,
        };
        if (env.BUILD) {
            capabilities.build = env.BUILD;
        }

        const builder = await new Builder();
        await builder.withCapabilities(capabilities);
        await builder.usingServer('https://ondemand.saucelabs.com/wd/hub');
        const driver = await builder.build();
        const session = await driver.getSession();

        driver.sessionID = session.id_;

        return driver;
    }

    static async getDriver(env, platform = MacBrowsers.platform, browser = 'CHROME_LATEST') {
        let driver;

        if (env.TEST_ENV === 'SAUCE') {
            driver = await WebDriverFactory.getSauceDriver(env, platform, browser);
        } else {
            driver = await WebDriverFactory.getLocalDriver(env, platform, browser);
        }

        return driver;
    }
}

export default WebDriverFactory;
