const { parallel, task } = require('gulp');
const exec = require('child_process').exec;
const sauceBrowserConfigs = require('./browser-configs-sauce.json');
const localBrowserConfigs = require('./browser-configs-local.json');

const execute = (env, platform, browser) => {

	const {
		SAUCE_USERNAME,
		SAUCE_ACCESS_KEY,
		BUILD_NUMBER,
		JOB_NAME,
	} = process.env;

	const cmd = `SAUCE_USERNAME=${process.env.SAUCE_USERNAME} SAUCE_ACCESS_KEY=${process.env.SAUCE_ACCESS_KEY} TEST_ENV="${env}" PLATFORM="${platform}" BROWSER="${browser}" yarn test`;

	console.log('Command: ', cmd);
	return exec(cmd);

};

const executeSauceTests = (cb) => {

	sauceBrowserConfigs.forEach((config) => {

		execute('SAUCE', config.platform, config.browser);

	});

	cb();

};

const testWin = (cb) => {

	localBrowserConfigs.forEach((config) => {

		if (config.platform === 'windows') {

			execute('local', config.platform, config.browser);

		}

	});

	cb();

};

const testMac = (cb) => {

	localBrowserConfigs.forEach((config) => {

		if (config.platform === 'macos') {

			execute('local', config.platform, config.browser);

		}

	});

	cb();

};

const platformTest = (cb) => {

	const platform = process.platform;

	if (platform === 'win32') {

		testWin(cb);

	} else if (platform === 'darwin') {

		testMac(cb);

	} else {

		console.log('Interesting...win and mac only at the moment.');

	}

	cb();

};

exports.testMac = testMac;
exports.testWin = testWin;
exports.executeSauceTests = executeSauceTests;
exports.default = platformTest
