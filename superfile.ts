const { join } = require("path");

const exec = require('await-exec')
const { superCI, report } = require("super-ci");
const { buildSize } = require("build-size-super-plugin");

module.exports.main = async function main() {
  await buildSize({
    path: "./build/static/js",
  });

  

  if (superCI.isPr()) {
    await superCI.saveCollection("build", join(__dirname, "build"));
    report(`Branch deployment: https://s3-eu-west-1.amazonaws.com/superci-bucket/91cf4ed2-b523-4cca-874c-0ee73f3b5a72/${superCI.context.currentSha}/build/index.html`);
  }
};

function visReg() {
  superCI.getCollection("storybook-vis-reg", join(__dirname, "base-screenshots"));
  exec("yarn storybook:screenshots");
}