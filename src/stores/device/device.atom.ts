import { Peripheral } from 'react-native-ble-manager';
import { atom } from 'recoil';

const deviceInfoState = atom<Peripheral>({
  key: 'deviceInfoState',
  default: {} as Peripheral,
});
export { deviceInfoState };
