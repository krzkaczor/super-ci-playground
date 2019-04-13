const { join } = require("path");
const { writeFileSync } = require("fs");

const exec = require("await-exec");
const { codechecks } = require("@codechecks/client");
const { buildSizeWatcher } = require("@codechecks/build-size-watcher");

const execOptions = { timeout: 100000, cwd: process.cwd(), log: true };

module.exports.main = async function main() {
  await buildSizeWatcher({
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

  await watchLockFiles();

  if (codechecks.isPr()) {
    await codechecks.saveCollection("build", join(__dirname, "build"));
    await codechecks.success({
      name: "Per commit deployment",
      shortDescription: `Commit deployed`,
      detailsUrl: {
        url: codechecks.getArtifactLink("build/index.html"),
        label: "Deployment",
      },
    });
  }

  await stressTest();
};

async function visReg() {
  await exec("yarn storybook:screenshots", execOptions);
  await codechecks.saveCollection("storybook-vis-reg", join(__dirname, "__screenshots__"));

  if (codechecks.isPr()) {
    await codechecks.getCollection("storybook-vis-reg", join(__dirname, ".reg/expected"));
    await exec("./node_modules/.bin/reg-suit compare", execOptions);

    await codechecks.saveCollection("storybook-vis-reg-report", join(__dirname, ".reg"));

    await codechecks.success({
      name: "Visual Regression",
      shortDescription: "Changed: 1\n New: 4\n Removed: 0",
      detailsUrl: codechecks.getArtifactLink("storybook-vis-reg-report/index.html"),
    });
  }
}

async function watchLockFiles() {
  const hasPackageLock =
    codechecks.context.isPr &&
    codechecks.context.pr.files.added.filter(f => f === "package-lock.json").length > 0;

  if (hasPackageLock) {
    await codechecks.failure({
      name: "Package lock mismatch",
      shortDescription: "NPM package lock file is prohibited",
    });
  }
}

async function stressTest() {
  for (let i = 0; i < 1005; i++) {
    writeFileSync(join(__dirname, "dummy", `${i}.txt`), `dummy test${i}`);
  }

  await codechecks.saveCollection("stress", join(__dirname, "dummy"));
  await codechecks.getCollection("stress", join(__dirname, "dummy2"));
}
