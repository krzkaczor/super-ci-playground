const { join } = require("path");

const exec = require("await-exec");
const { codeChecks } = require("codechecks");
const { buildSize } = require("codecheck-build-size");

const execOptions = { timeout: 100000, cwd: process.cwd(), log: true };

module.exports.main = async function main() {
  await exec("yarn storybook:screenshots", execOptions);

  const allPromises = [];
  for (let i = 0; i < 1000; i++) {
    allPromises.push(
      codeChecks.saveCollection("storybook-vis-reg", join(__dirname, "__screenshots__")),
    );
    allPromises.push(
      codeChecks.saveCollection("storybook-vis-reg-report", join(__dirname, ".reg")),
    );
  }

  await Promise.all(allPromises);
};
