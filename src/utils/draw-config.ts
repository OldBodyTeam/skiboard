import { cloneDeep } from 'lodash';

const drawData = new Map<number, Map<string, { selectStatus: boolean }>>();
const data = [1, 3, 5, 5, 7, 7, 9, 9, 11, 11, 13, 13, 15, 17, 15];
for (let i = 0; i < data.length; i++) {
  const col = new Map();

  for (let j = 0; j < data[i]; j++) {
    col.set(`${i}-${j}`, { selectStatus: false });
  }

  drawData.set(i, col);
}
export type DrawBlockType = Map<number, Map<string, { selectStatus: boolean }>>;
export type DrawRestoreStackType = {
  prev: Array<{ x: number; y: number }>;
  next: Array<{ x: number; y: number }>;
};
const getInitOptData = () => {
  return {
    drawBlock: new Map(drawData),
    drawRestoreStack: {
      prev: [] as { x: number; y: number }[],
      next: [] as { x: number; y: number }[],
    },
  };
};
const covertCanUseCanvasData = (drawCanvas: DrawBlockType) => {
  const drawBlockObj = Object.fromEntries(drawCanvas);
  return Object.keys(drawBlockObj).map(v => {
    const drawBlockItemObj = Object.fromEntries(drawBlockObj[v]);
    return Object.keys(drawBlockItemObj).map(k => drawBlockItemObj[k]);
  });
};
const covertDataToServer = (
  webData: {
    selectStatus: boolean;
  }[][],
) => {
  return webData.map(item => {
    return item
      .map((v, index) => {
        return v.selectStatus ? index : null;
      })
      .filter((v): v is number => typeof v === 'number');
  });
};
const covertMap = (scrollText: number[][]) => {
  // const coverLiterMap = new Map<string, DrawBlockType>();
  // Object.keys(scrollText).forEach((v) => {
  const optData = cloneDeep(drawData);
  scrollText.forEach((item, index) => {
    const row = optData.get(index);
    item.forEach(b => {
      row?.set(`${index}-${b}`, { selectStatus: true });
    });
    // });
    // coverLiterMap.set(String(v), optData);
  });
  return optData;
};
export {
  covertCanUseCanvasData,
  getInitOptData,
  drawData,
  covertDataToServer,
  covertMap,
};
