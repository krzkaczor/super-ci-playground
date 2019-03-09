const { join } = require("path");

const exec = require("await-exec");
const { codeChecks } = require("codechecks");
const { buildSize } = require("build-size-super-plugin");

const execOptions = { timeout: 100000, cwd: process.cwd(), log: true };

module.exports.main = async function main() {
  await buildSize({
    files: [
      {
        path: "./build/static/js/*.js",
      },
      {
        path: "./build/static/css/*.css",
      },
    ],
  });

  await visReg();

  if (codeChecks.isPr()) {
    await codeChecks.saveCollection("build", join(__dirname, "build"));
    await codeChecks.success({
      name: "Per commit deployment",
      shortDescription: `Commit deployed`,
      detailsUrl: codeChecks.getArtifactLink("build/index.html"),
    });
  }
};

async function visReg() {
  await exec("yarn storybook:screenshots", execOptions);
  await codeChecks.saveCollection("storybook-vis-reg", join(__dirname, "__screenshots__"));

  if (codeChecks.isPr()) {
    await codeChecks.getCollection("storybook-vis-reg", join(__dirname, ".reg/expected"));
    await exec("./node_modules/.bin/reg-suit compare", execOptions);

    await codeChecks.saveCollection("storybook-vis-reg-report", join(__dirname, ".reg"));

    await codeChecks.success({
      name: "Visual Regression",
      shortDescription: "Changed: 1\n New: 4\n Removed: 0",
      detailsUrl: codeChecks.getArtifactLink("storybook-vis-reg-report/index.html"),
    });
  }
}
