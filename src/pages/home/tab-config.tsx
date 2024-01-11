import React from 'react';
import LightScreen from '@pages/light-screen/LightScreen';
import MusicScreen from '@pages/music-screen/MusicScreen';
import DesignScreen from '@pages/design-screen/DesignScreen';

const TabConfig = [
  {
    name: 'DesignScreen',
    component: DesignScreen,
    selectedIcon: require('../../assets/selected-design.png'),
    icon: require('../../assets/design.png'),
  },
  {
    name: 'LightScreen',
    component: LightScreen,
    selectedIcon: require('../../assets/selected-light.png'),
    icon: require('../../assets/light.png'),
  },
  {
    name: 'MusicScreen',
    component: MusicScreen,
    selectedIcon: require('../../assets/selected-music.png'),
    icon: require('../../assets/music.png'),
  },
];
export { TabConfig };
