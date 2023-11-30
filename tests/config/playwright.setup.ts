import { cpSync } from "node:fs";
const fixturesDir = "./tests/fixtures";

export default () => {
  cpSync("./dist/index.modern.js", `${fixturesDir}/dist/index.modern.js`);
};
