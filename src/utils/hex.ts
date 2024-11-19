const getHex = (num: number) => {
  const covertNum = num + 1;
  if (covertNum < 16) {
    return '0' + covertNum.toString(16);
  } else {
    return covertNum.toString(16);
  }
};
const getSimpleHex = (num: number) => {
  return num.toString(16);
};
export { getHex, getSimpleHex };
