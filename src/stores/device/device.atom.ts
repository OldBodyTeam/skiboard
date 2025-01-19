import { Peripheral } from 'react-native-ble-manager';
// import { atom } from 'recoil';

import { atom } from 'jotai';

// const deviceInfoState = atom<Peripheral>({
//   key: 'deviceInfoState',
//   default: {} as Peripheral,
// });
// const butteryState = atom<number>({
//   key: 'buttery',
//   default: 0,
// });
const deviceInfoState = atom<Peripheral>({} as Peripheral);
const butteryState = atom(0);

export { deviceInfoState, butteryState };
