const { join } = require("path");

const exec = require("await-exec");
const { superCI, report } = require("super-ci");
const { buildSize } = require("build-size-super-plugin");

const execOptions = { timeout: 100000, cwd: process.cwd(), log: true };

module.exports.main = async function main() {
  // await buildSize({
  //   path: "./build/static/js",
  // });

  await visReg();

  if (superCI.isPr()) {
    await superCI.saveCollection("build", join(__dirname, "build"));
    report({
      name: "Per commit deployment",
      shortDescription: `[Branch deployment](${superCI.getArtifactLink("build/index.html")})`,
      description: `[Branch deployment](${superCI.getArtifactLink("build/index.html")})`,
      detailsUrl: superCI.getArtifactLink("build/index.html"),
    });
  }
};

async function visReg() {
  await exec("yarn storybook:screenshots", execOptions);
  await superCI.saveCollection("storybook-vis-reg", join(__dirname, "__screenshots__"));

  if (superCI.isPr()) {
    await superCI.getCollection("storybook-vis-reg", join(__dirname, ".reg/expected"));
    await exec("./node_modules/.bin/reg-suit compare", execOptions);

    await superCI.saveCollection("storybook-vis-reg-report", join(__dirname, ".reg"));

    report({
      name: "Visual Regression",
      shortDescription: "Changed: 1\n New: 4\n Removed: 0",
      description: "",
      detailsUrl: superCI.getArtifactLink("storybook-vis-reg-report/index.html"),
    });
  }
}
