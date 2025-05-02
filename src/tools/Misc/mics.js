const todp = (num, precision = 2) => {
  //   const precision = precision;
  const output = parseFloat(
    (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(
      precision,
    ),
  );
  if (Number.isNaN(output)) {
    return 0;
  } else {
    return output;
  }
};

const wait = seconds => {
  return new Promise((resolve, reject) => {
    if (!seconds) {
      return reject(new Error('seconds is not pass in'));
    }
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
};

const generateUniqueCode = (prefix = '', postfix = '') => {
  return (
    prefix +
    (Math.random().toString(36) + Date.now().toString(36))
      .substr(2, 9)
      .toUpperCase() +
    postfix
  );
};

module.exports = {
  todp,
  wait,
  generateUniqueCode,
};
