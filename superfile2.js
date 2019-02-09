const { superCI } = require("super-ci");

module.exports.main = async function main() {
  superCI.report("LATER COMMENT THAT SHOULD BE MERGED!");
}