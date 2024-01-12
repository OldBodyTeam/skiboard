import BleManager from '@pages/ble-manager/BleManager';
import ColorPickerPage from '@pages/color-picker/ColorPicker';
import DeviceList from '@pages/device-list/DeviceList';
import Home from '@pages/home/Home';
import Login from '@pages/login/Login';
import Register from '@pages/register/Register';
export type RootStackParamList = {
  Login: any;
  Register: any;
  BleManager: any;
  ColorPickerPage: any;
  Home: any;
  DeviceList: any;
};
const routeConfig = [
  {
    name: 'Login',
    component: Login,
  },
  {
    name: 'Register',
    component: Register,
  },
  {
    name: 'BleManager',
    component: BleManager,
  },
  {
    name: 'ColorPickerPage',
    component: ColorPickerPage,
  },
  {
    name: 'Home',
    component: Home,
  },
  {
    name: 'DeviceList',
    component: DeviceList,
  },
] as const;
export { routeConfig };
