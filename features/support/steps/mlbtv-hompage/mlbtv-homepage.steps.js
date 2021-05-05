import 'regenerator-runtime/runtime';
import { expect } from 'chai';
import BaseHomepage from '../../utils/pages/base-homepage';
import { By, until, browser } from 'selenium-webdriver';
import { setDefaultTimeout, BeforeAll, Before, AfterAll, After, Given, When, Then } from 'cucumber';
import { USER_TYPES } from '../../data/user-data';

let homePage;
let jobStatus = true;

setDefaultTimeout(60 * 1000);

Before(function (scenario, next) {
    const { uri, line } = scenario.sourceLocation;
    const { name, locations, steps } = scenario.pickle;
    const context = `"${name}" -> ${uri} -> ln. ${line}`;

    homePage = new BaseHomepage(process.env, process.env.PLATFORM, process.env.BROWSER);
    homePage.init().then(() => {
        if (process.env.TEST_ENV === 'SAUCE') {
            homePage.driver.executeScript(`sauce:context=${context}`);
        }
        next();
    });
});

AfterAll(async function () {
    if (process.env.TEST_ENV === 'SAUCE') {
        homePage.driver.executeScript(`sauce:job-result=${jobStatus}`);
    }

    return;
});

After(function (scenarioResult, next) {
    const { uri, line } = scenarioResult.sourceLocation;
    const { name, locations, steps } = scenarioResult.pickle;
    const { duration, status } = scenarioResult.result;

    jobStatus = status === 'passed';

    homePage.driver.quit();
    homePage = null;

    next();
});

Given('A logged out user visits the mlb.tv homepage', async function () {
    return homePage.visit();
});

Given('A logged in and entitled user visits the mlb.tv homepage', async function () {
    const entitledUser = homePage.getEntitledUser();
    return homePage.logUserIn(entitledUser).then(() => {
        return homePage.visit();
    });
});

Then('They are redirected to the mlb.tv sell page', async function () {
    return homePage.driver
        .wait(
            until.elementLocated(By.css('#forge-pagebuilder_index')),
            BaseHomepage.SLEEP_DURATION * 4,
        )
        .then(() => {
            return homePage.driver.getCurrentUrl();
        })
        .then((url) => {
            return expect(url.indexOf('/live-stream-games/subscribe')).to.be.greaterThan(-1);
        });
});

Then('They can view the mlb.tv homepage', async function () {
    return homePage.driver
        .wait(
            until.elementLocated(By.css('#mlbtv_welcome-center')),
            BaseHomepage.SLEEP_DURATION * 4,
        )
        .then(() => {
            return homePage.driver.getCurrentUrl();
        })
        .then((url) => {
            return expect(url.indexOf('/tv')).to.be.greaterThan(-1);
        });
});

/* Given('I visit the SVOD player page', async function () {
    return playerPage.visit().then((featuredApp) => {
        expect(featuredApp).not.to.be.undefined;
    });
});

Given('I visit the SVOD player page for subtitled media', async function () {
    return playerPage.visitSubtitleMedia();
});

Then('I am redirected to the login page', async function () {
    return playerPage.driver
        .wait(
            until.elementLocated(By.css('.connect__main-container--login')),
            BaseHomepage.SLEEP_DURATION * 4,
        )
        .then(() => {
            return playerPage.driver.getCurrentUrl();
        })
        .then((url) => {
            expect(url.indexOf('/login')).to.be.greaterThan(-1);
        });
});

When('I log in with a valid entitled account', async function () {
    const user = playerPage.getEntitledUser(USER_TYPES.MLBALL);
    return playerPage.logUserIn(user);
});

When('I log in with a valid unentitled account', async function () {
    const user = playerPage.getUnentitledUser(USER_TYPES.MLBALL);
    return playerPage.logUserIn(user);
});

Then('I am redirected back to the SVOD player page', async function () {
    return playerPage.driver
        .wait(until.elementLocated(By.css('#featured-app')), BaseHomepage.SLEEP_DURATION * 4)
        .then(() => {
            return playerPage.driver.getCurrentUrl();
        })
        .then((url) => {
            expect(url.indexOf('/tv/featured')).to.be.greaterThan(-1);
        });
});

Then('A message is displayed', async function () {
    return playerPage.driver
        .wait(
            until.elementLocated(By.css('.toaster-message-container')),
            BaseHomepage.SLEEP_DURATION * 4,
        )
        .then(async () => {
            const body = await playerPage.driver.findElement(By.css('.toaster-message--body'));
            return body.getText();
        })
        .then(async (bodyText) => {
            const closeBtn = await playerPage.driver.findElement(
                By.css('.toaster-message--close-button'),
            );
            const linkBtn = await playerPage.driver.findElement(
                By.css('.toaster-message--link-button'),
            );
            expect(bodyText).to.equal('An MLB.TV subscription is required to view this content.');
            expect(linkBtn).not.to.be.null;
            expect(closeBtn).not.to.be.null;
        });
});

Then('The default media starts playback', async function () {
    return playerPage.driver
        .sleep(BaseHomepage.SLEEP_DURATION * 2)
        .then((videoEl) => {
            return playerPage.videoEl;
        })
        .then((videoEl) => {
            return playerPage.driver.executeScript('return arguments[0].currentTime', videoEl);
        })
        .then((currentTime) => {
            expect(currentTime).to.be.greaterThan(0);
        });
});

When('The user clicks a media item', async function () {
    return playerPage.secondPlaylistItem.then((playlistItem) => {
        playlistItem.click();
    });
});

Then('That media item starts playback', async function () {
    return playerPage.driver
        .sleep(BaseHomepage.SLEEP_DURATION * 2)
        .then((videoEl) => {
            return playerPage.videoEl;
        })
        .then((videoEl) => {
            return playerPage.driver.executeScript('return arguments[0].currentTime', videoEl);
        })
        .then((currentTime) => {
            expect(currentTime).to.be.greaterThan(0);
        });
});

Then('Captions should be available for the media', async function () {
    return playerPage.driver
        .sleep(BaseHomepage.SLEEP_DURATION * 2)
        .then((videoEl) => {
            return playerPage.videoEl;
        })
        .then((videoEl) => {
            return playerPage.driver.executeScript(
                'return arguments[0].textTracks.length',
                videoEl,
            );
        })
        .then((tracksLength) => {
            expect(tracksLength).to.be.greaterThan(0);
        });
});

Then('The standard set of playback controls are available', async function () {
    return playerPage.driver.sleep(BaseHomepage.SLEEP_DURATION * 2).then(async () => {
        const rewind = await playerPage.quickRewind;
        const ff = await playerPage.quickFastForward;
        const playPause = await playerPage.playPause;
        const mute = await playerPage.mute;
        const volumeSlider = await playerPage.volumeSlider;
        const closedCaptions = await playerPage.closedCaptions;
        const fullscreen = await playerPage.fullscreen;
        const progressBar = await playerPage.progressBar;
        const currentTimeLabel = await playerPage.currentTimeLabel;
        const durationLabel = await playerPage.durationLabel;
        expect(rewind).not.to.be.undefined;
        expect(ff).not.to.be.undefined;
        expect(playPause).not.to.be.undefined;
        expect(mute).not.to.be.undefined;
        expect(volumeSlider).not.to.be.undefined;
        expect(closedCaptions).not.to.be.undefined;
        expect(fullscreen).not.to.be.undefined;
        expect(progressBar).not.to.be.undefined;
        expect(currentTimeLabel).not.to.be.undefined;
        expect(durationLabel).not.to.be.undefined;
    });
});

Then('The URL updates to include the slug of the default clip', async function () {
    const baseUrl = await playerPage.url;
    const derivedEnv = playerPage.derivedEnv;
    return playerPage.driver
        .sleep(BaseHomepage.SLEEP_DURATION)
        .then(() => {
            return playerPage.driver.getCurrentUrl();
        })
        .then((currentUrl) => {
            // TODO: can we load the playlist to get these dynamically?
            const slug = derivedEnv === 'npd' ? 'williamsport-to-the-bigs' : 'a-perfect-game';

            expect(currentUrl.length).to.be.greaterThan(baseUrl.length);
            expect(currentUrl.indexOf(slug)).to.be.greaterThan(-1);
        });
});

Then('The URL updates to include the slug of the selected clip', async function () {
    const baseUrl = await playerPage.url;
    const derivedEnv = playerPage.derivedEnv;
    return playerPage.driver
        .sleep(BaseHomepage.SLEEP_DURATION)
        .then(() => {
            return playerPage.driver.getCurrentUrl();
        })
        .then((currentUrl) => {
            // TODO: can we load the playlist to get these dynamically?
            const slug = derivedEnv === 'npd' ? 'one-game-season' : '971-pirates-forever-brothers';

            expect(currentUrl.length).to.be.greaterThan(baseUrl.length);
            expect(currentUrl.indexOf(slug)).to.be.greaterThan(-1);
        });
});

Then('The playlist displays available clips', async function () {
    return playerPage.driver
        .sleep(BaseHomepage.SLEEP_DURATION)
        .then(() => {
            return playerPage.playlistContainer;
        })
        .then((playlistContainer) => {
            // Get the immediate children
            return playlistContainer.findElements(By.xpath('*'));
        })
        .then((playlistChildren) => {
            // with the qa data this will be 12, but could be much more with prod data
            expect(playlistChildren.length).to.be.greaterThan(1);
        });
});

Then(
    'The selected playlist item displays the poster image, description, date, but no duration',
    async function () {
        return playerPage.driver
            .sleep(BaseHomepage.SLEEP_DURATION)
            .then(() => {
                return playerPage.firstPlaylistItem;
            })
            .then(async (playlistItem) => {
                const duration = await playlistItem.findElement(
                    By.css('div > div:nth-child(1) > p'),
                );
                const poster = await playlistItem.findElement(
                    By.css('div > div:nth-child(1) > div'),
                );
                const description = await playlistItem.findElement(
                    By.css('div > div:nth-child(2) > div'),
                );
                const date = await playlistItem.findElement(By.css('div > div:nth-child(2) > p'));
                const durationText = await duration.getText();
                const descriptionText = await description.getText();
                const dateText = await date.getText();
                expect(poster).not.to.be.undefined;
                expect(durationText.length).to.be.equal(0);
                expect(dateText.length).to.be.greaterThan(0);
            });
    },
);

Then(
    'The second playlist item displays the poster image, description, date and duration',
    async function () {
        return playerPage.driver
            .sleep(BaseHomepage.SLEEP_DURATION)
            .then(() => {
                return playerPage.firstPlaylistItem;
            })
            .then(async (playlistItem) => {
                const duration = await playlistItem.findElement(
                    By.css('div > div:nth-child(1) > p'),
                );
                const poster = await playlistItem.findElement(
                    By.css('div > div:nth-child(1) > div'),
                );
                const description = await playlistItem.findElement(
                    By.css('div > div:nth-child(2) > div'),
                );
                const date = await playlistItem.findElement(By.css('div > div:nth-child(2) > p'));
                const durationText = await duration.getText();
                const descriptionText = await description.getText();
                const dateText = await date.getText();
                expect(poster).not.to.be.undefined;
                expect(durationText.length).to.be.greaterThan(0);
                expect(dateText.length).to.be.greaterThan(0);
            });
    },
);

Then('The selected media item is moved to the top of the list', async function () {
    return playerPage.driver
        .sleep(BaseHomepage.SLEEP_DURATION)
        .then(() => {
            return playerPage.firstPlaylistItem;
        })
        .then(async (playlistItem) => {
            const derivedEnv = playerPage.derivedEnv;
            const testDescription =
                derivedEnv === 'npd' ? 'One-Game Season' : '1971 Pirates: Forever Brothers';
            const description = await playlistItem.findElement(
                By.css('div > div:nth-child(2) > div'),
            );
            const descriptionText = await description.getText();
            expect(testDescription).to.equal(testDescription);
        });
});

Then('Metadata is displayed for the player', async function () {
    return playerPage.driver.sleep(BaseHomepage.SLEEP_DURATION).then(async () => {
        const metadataTitle = await playerPage.metadataTitle;
        const metadataDateDuration = await playerPage.metadataDateDuration;
        const metadataDescription = await playerPage.metadataDescription;
        const titleText = await metadataTitle.getText();
        const dateDurationText = await metadataDateDuration.getText();
        const descriptionText = await metadataDescription.getText();
        expect(titleText.length).to.be.greaterThan(0);
        expect(dateDurationText.length).to.be.greaterThan(0);
        expect(descriptionText.length).to.be.greaterThan(0);
    });
});

Then('Metadata is updated when the clip is updated', async function () {
    let initialTitle;
    let initialDescription;
    let initialDateDuration;
    return playerPage.driver
        .sleep(BaseHomepage.SLEEP_DURATION)
        .then(async () => {
            const metadataTitle = await playerPage.metadataTitle;
            const metadataDateDuration = await playerPage.metadataDateDuration;
            const metadataDescription = await playerPage.metadataDescription;
            initialTitle = await metadataTitle.getText();
            initialDescription = await metadataDateDuration.getText();
            initialDateDuration = await metadataDescription.getText();

            return playerPage.driver.findElement(By.css('input[type="submit"]'));
        })
        .then((submitBtn) => {
            submitBtn.click();
        })
        .then(async () => {
            const metadataTitle = await playerPage.metadataTitle;
            const metadataDateDuration = await playerPage.metadataDateDuration;
            const metadataDescription = await playerPage.metadataDescription;
            const titleText = await metadataTitle.getText();
            const descriptionText = await metadataDateDuration.getText();
            const dateDurationText = await metadataDescription.getText();

            expect(titleText).not.to.be.undefined;
            expect(titleText).not.to.equal(initialTitle);
            expect(descriptionText).not.to.be.undefined;
            expect(descriptionText).not.to.equal(initialDescription);
            expect(dateDurationText).not.to.be.undefined;
            expect(dateDurationText).not.to.equal(initialDateDuration);
        });
}); */
