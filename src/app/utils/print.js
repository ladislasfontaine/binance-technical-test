const printMessage = (message) => {
  const date = new Date().toISOString();
  console.log(`${date} - ${message}`);
};

module.exports = {
  printMessage,
};
