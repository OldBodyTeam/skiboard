import BleManager from '@pages/ble-manager/BleManager';
import ColorPickerPage from '@pages/color-picker/ColorPicker';
import DeviceList from '@pages/device-list/DeviceList';
import EditLight from '@pages/edit-light/EditLight';
import Home from '@pages/home/Home';
import LightGlowModes from '@pages/light-glow-modes/LightGlowModes';
import LightList from '@pages/light-list/LightList';
import Login from '@pages/login/Login';
import Register from '@pages/register/Register';
import Scenes from '@pages/scenes/Scenes';
import ScrollText from '@pages/scroll-text/ScrollText';
import Settings from '@pages/settings/Settings';
export type RootStackParamList = {
  Login: any;
  Register: any;
  BleManager: any;
  ColorPickerPage: any;
  Home: any;
  DeviceList: any;
  EditLight: any;
  LightList: any;
  ScrollText: any;
  Scenes: any;
  Settings: any;
  LightGlowModes: any;
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
  {
    name: 'EditLight',
    component: EditLight,
  },
  {
    name: 'LightList',
    component: LightList,
  },
  {
    name: 'ScrollText',
    component: ScrollText,
  },
  {
    name: 'Scenes',
    component: Scenes,
  },
  {
    name: 'Settings',
    component: Settings,
  },
  {
    name: 'LightGlowModes',
    component: LightGlowModes,
  },
] as const;
export { routeConfig };
