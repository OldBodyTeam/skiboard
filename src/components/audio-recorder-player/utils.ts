const coverVoiceToHeight = (
  x: number,
  factor: number,
  height: number,
  speed: number,
  delta: number,
) => {
  const xComp = x;
  const sinSeed = (factor + xComp) * speed; // (50 + 0) * 7.5
  const sinHeight = Math.sin(sinSeed / 100) * delta;
  const yPos = Math.sin(sinSeed / 100) * sinHeight + height;
  console.log('当前x,t', x, yPos);
  return yPos;
};
export { coverVoiceToHeight };
