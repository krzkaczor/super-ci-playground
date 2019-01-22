const { join } = require("path");

const exec = require("await-exec");
const { superCI, report } = require("super-ci");
const { buildSize } = require("build-size-super-plugin");

const execOptions = { timeout: 100000, cwd: process.cwd(), log: true };

module.exports.main = async function main() {
  await buildSize({
    path: "./build/static/js",
  });

  await visReg();

  if (superCI.isPr()) {
    await superCI.saveCollection("build", join(__dirname, "build"));
    report(
      `Branch deployment: https://s3-eu-west-1.amazonaws.com/superci-bucket/91cf4ed2-b523-4cca-874c-0ee73f3b5a72/${
        superCI.context.currentSha
      }/build/index.html`,
    );
  }
};

async function visReg() {
  await exec("yarn storybook:screenshots", execOptions);
  await superCI.saveCollection("storybook-vis-reg", join(__dirname, "__screenshots__"));

  if (superCI.isPr()) {
    await superCI.getCollection("storybook-vis-reg", join(__dirname, ".reg/expected"));
    await exec("./node_modules/.bin/reg-suit compare", execOptions);

    await superCI.saveCollection("storybook-vis-reg-report", join(__dirname, ".reg"));

    report(
      `Vis reg report: https://s3-eu-west-1.amazonaws.com/superci-bucket/91cf4ed2-b523-4cca-874c-0ee73f3b5a72/${
        superCI.context.currentSha
      }/storybook-vis-reg-report/index.html`,
    );
  }
}
