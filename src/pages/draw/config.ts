import { cloneDeep } from 'lodash';
import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
const currentWidth = () => {
  const a = Math.floor(width / 17);
  const b = Math.floor(a / 2);
  return b * 2;
};
const blockWidth = currentWidth();
const getItemPoi = (itemNum: number, yDistance: number) => {
  const a = itemNum * blockWidth; // 点占的宽度
  const b = (width - a) / 2; // 第一个点的坐标
  const arr = [];
  for (let i = 0; i < itemNum; i++) {
    arr.push({
      x: b + blockWidth * i,
      y: yDistance * blockWidth,
      width: blockWidth,
      height: blockWidth,
      target: `${yDistance}-${i}`,
    });
  }
  return arr;
};
const drawData = new Map<number, Map<string, { selectStatus: boolean }>>();
export const data = [1, 3, 5, 5, 7, 7, 9, 9, 11, 11, 13, 13, 15, 17, 15];
export const getPointPoi = data
  .map((item, index) => {
    return getItemPoi(item, index);
  })
  .flat();

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
const poi = new Map();
poi.set('0-0', '08');
poi.set('1-0', '17');
poi.set('1-1', '18');
poi.set('1-2', '19');
poi.set('2-0', '26');
poi.set('2-1', '27');
poi.set('2-2', '28');
poi.set('2-3', '29');
poi.set('2-4', '2a');

poi.set('3-0', '36');
poi.set('3-1', '37');
poi.set('3-2', '38');
poi.set('3-3', '39');
poi.set('3-4', '3a');

poi.set('4-0', '45');
poi.set('4-1', '46');
poi.set('4-2', '47');
poi.set('4-3', '48');
poi.set('4-4', '49');
poi.set('4-5', '4a');
poi.set('4-6', '4b');

poi.set('5-0', '55');
poi.set('5-1', '56');
poi.set('5-2', '57');
poi.set('5-3', '58');
poi.set('5-4', '59');
poi.set('5-5', '5a');
poi.set('5-6', '5b');

poi.set('6-0', '64');
poi.set('6-1', '65');
poi.set('6-2', '66');
poi.set('6-3', '67');
poi.set('6-4', '68');
poi.set('6-5', '69');
poi.set('6-6', '6a');
poi.set('6-7', '6b');
poi.set('6-8', '6c');

poi.set('7-0', '74');
poi.set('7-1', '75');
poi.set('7-2', '76');
poi.set('7-3', '77');
poi.set('7-4', '78');
poi.set('7-5', '79');
poi.set('7-6', '7a');
poi.set('7-7', '7b');
poi.set('7-8', '7c');

poi.set('8-0', '83');
poi.set('8-1', '84');
poi.set('8-2', '85');
poi.set('8-3', '86');
poi.set('8-4', '87');
poi.set('8-5', '88');
poi.set('8-6', '89');
poi.set('8-7', '8a');
poi.set('8-8', '8b');
poi.set('8-9', '8c');
poi.set('8-10', '8d');

poi.set('9-0', '93');
poi.set('9-1', '94');
poi.set('9-2', '95');
poi.set('9-3', '96');
poi.set('9-4', '97');
poi.set('9-5', '98');
poi.set('9-6', '99');
poi.set('9-7', '9a');
poi.set('9-8', '9b');
poi.set('9-9', '9c');
poi.set('9-10', '9d');

poi.set('10-0', 'a2');
poi.set('10-1', 'a3');
poi.set('10-2', 'a4');
poi.set('10-3', 'a5');
poi.set('10-4', 'a6');
poi.set('10-5', 'a7');
poi.set('10-6', 'a8');
poi.set('10-7', 'a9');
poi.set('10-8', 'aa');
poi.set('10-9', 'ab');
poi.set('10-10', 'ac');
poi.set('10-11', 'ad');
poi.set('10-12', 'ae');

poi.set('11-0', 'b2');
poi.set('11-1', 'b3');
poi.set('11-2', 'b4');
poi.set('11-3', 'b5');
poi.set('11-4', 'b6');
poi.set('11-5', 'b7');
poi.set('11-6', 'b8');
poi.set('11-7', 'b9');
poi.set('11-8', 'ba');
poi.set('11-9', 'bb');
poi.set('11-10', 'bc');
poi.set('11-11', 'bd');
poi.set('11-12', 'be');

poi.set('12-0', 'c1');
poi.set('12-1', 'c2');
poi.set('12-2', 'c3');
poi.set('12-3', 'c4');
poi.set('12-4', 'c5');
poi.set('12-5', 'c6');
poi.set('12-6', 'c7');
poi.set('12-7', 'c8');
poi.set('12-8', 'c9');
poi.set('12-9', 'ca');
poi.set('12-10', 'cb');
poi.set('12-11', 'cc');
poi.set('12-12', 'cd');
poi.set('12-13', 'ce');
poi.set('12-14', 'cf');

poi.set('13-0', 'd0');
poi.set('13-1', 'd1');
poi.set('13-2', 'd2');
poi.set('13-3', 'd3');
poi.set('13-4', 'd4');
poi.set('13-5', 'd5');
poi.set('13-6', 'd6');
poi.set('13-7', 'd7');
poi.set('13-8', 'd8');
poi.set('13-9', 'd9');
poi.set('13-10', 'da');
poi.set('13-11', 'db');
poi.set('13-12', 'dc');
poi.set('13-13', 'dd');
poi.set('13-14', 'de');
poi.set('13-15', 'df');
poi.set('13-16', 'ff');
poi.set('14-0', 'e1');
poi.set('14-1', 'e2');
poi.set('14-2', 'e3');
poi.set('14-3', 'e4');
poi.set('14-4', 'e5');
poi.set('14-5', 'e6');
poi.set('14-6', 'e7');
poi.set('14-7', 'e8');
poi.set('14-8', 'e9');
poi.set('14-9', 'ea');
poi.set('14-10', 'eb');
poi.set('14-11', 'ec');
poi.set('14-12', 'ed');
poi.set('14-13', 'ee');
poi.set('14-14', 'ef');
export {
  covertCanUseCanvasData,
  getInitOptData,
  drawData,
  covertDataToServer,
  covertMap,
  poi,
};
