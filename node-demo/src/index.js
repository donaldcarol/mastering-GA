const lodash = require("lodash");

function greet(name) {
  const formattedName = lodash.startCase(name);

  return `Hello, ${formattedName}!`;
}

if (require.main === module) {
  const message = greet("donald_carol");
  console.log(message);
}

module.exports = { greet };