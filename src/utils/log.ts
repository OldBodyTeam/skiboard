import { BLEConfig } from './ble';

const Logger = (message: any) => {
  if (__DEV__) {
    console.debug(message);
  }
};
const BLEWriteLogger = (code: string) => {
  const findKeysWithValues = (
    obj: Record<string, any>,
    targetValue: string,
  ) => {
    let keysWithTargetValue = [] as string[];

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = key;
      // 如果是对象，继续递归搜索
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        keysWithTargetValue = keysWithTargetValue.concat(
          findKeysWithValues(value, targetValue),
        );
      } else if (value === targetValue) {
        // 如果找到了目标值，记录当前的键路径
        keysWithTargetValue.push(currentPath);
      }
    }

    return keysWithTargetValue;
  };
  let arr = findKeysWithValues(BLEConfig, code);
  Logger(`正在写入${arr.join('****>')}${code}`);
};
export { Logger, BLEWriteLogger };
