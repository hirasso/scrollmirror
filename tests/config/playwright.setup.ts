import { cpSync, rmSync } from 'node:fs';

const options = { recursive: true };
const fixturesDir = './tests/fixtures';

export default () => {
	// rmSync('./tests/fixtures/dist/', { ...options, force: true });
	// cpSync('./dist/index.modern.js', `${fixturesDir}/dist/index.modern.js`);
};
