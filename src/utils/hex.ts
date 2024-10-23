const getHex = (num: number) => {
  const covertNum = num + 1;
  if (covertNum < 16) {
    return '0' + covertNum.toString(16);
  } else {
    return covertNum.toString(16);
  }
};
export { getHex };
