const { superCI } = require("super-ci");
const { buildSize } = require("build-size-super-plugin");

module.exports.main = async function main() {
  await buildSize({
    path: "./build/static/js",
  });

  await superCI.saveCollection("build", "./build");
};
