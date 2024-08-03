import Auth from '@pages/auth/Auth';
import BleManager from '@pages/ble-manager/BleManager';
import ColorPickerPage from '@pages/color-picker/ColorPicker';
import CreativePatterns from '@pages/creative-patterns/CreativePatterns';
import DeviceList from '@pages/device-list/DeviceList';
import EditLight from '@pages/edit-light/EditLight';
import Home from '@pages/home/Home';
import LEDStripsEffects from '@pages/led-strips-effects/LEDStripsEffects';
import LightGlowModes from '@pages/light-glow-modes/LightGlowModes';
import LightList from '@pages/light-list/LightList';
import Login from '@pages/entry/Entry';
import Register from '@pages/register/Register';
import Reset from '@pages/reset/Reset';
import Scenes from '@pages/scenes/Scenes';
import ScrollText from '@pages/scroll-text/ScrollText';
import Settings from '@pages/settings/Settings';
import SoundEffects from '@pages/sound-effects/SoundEffects';
// import TestBLE from '@pages/test-ble/TestBLE';
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
  SoundEffects: any;
  LEDStripsEffects: any;
  Auth: any;
  Reset: any;
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
  {
    name: 'SoundEffects',
    component: SoundEffects,
  },
  {
    name: 'LEDStripsEffects',
    component: LEDStripsEffects,
  },
  {
    name: 'Auth',
    component: Auth,
  },
  {
    name: 'Reset',
    component: Reset,
  },
  // {
  //   name: 'TestBLE',
  //   component: TestBLE,
  // },
  {
    name: 'CreativePatterns',
    component: CreativePatterns,
  },
] as const;
export { routeConfig };
