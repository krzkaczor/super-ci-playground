const { join } = require("path");

const exec = require("await-exec");
const { codeChecks } = require("codechecks");
const { buildSize } = require("codecheck-build-size");

const execOptions = { timeout: 100000, cwd: process.cwd(), log: true };

module.exports.main = async function main() {
  await exec("yarn storybook:screenshots", execOptions);

  for (let i = 0; i < 100; i++)
    await Promise.all([
      codeChecks.saveCollection("storybook-vis-reg", join(__dirname, "__screenshots__")),
      codeChecks.saveCollection("storybook-vis-reg-report", join(__dirname, ".reg")),
    ]);
};
