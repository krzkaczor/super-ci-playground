const { buildSize } = require("build-size-super-plugin");

module.exports.main = async function main() {
  await buildSize({
    path: "./build/static/js",
  });
};

