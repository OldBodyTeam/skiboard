import { Peripheral } from 'react-native-ble-manager';
import { atom } from 'recoil';

const deviceInfoState = atom<Peripheral>({
  key: 'deviceInfoState',
  default: {} as Peripheral,
});
const butteryState = atom<number>({
  key: 'buttery',
  default: 0,
});
export { deviceInfoState, butteryState };
