import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabConfig } from './tab-config';
import CustomTabBar from '@components/custom-tab-bar/CustomTabBar';

const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={{ headerShown: false }}
      initialRouteName="MusicScreen">
      {TabConfig.map(item => {
        return (
          <Tab.Screen
            name={item.name}
            component={item.component}
            key={item.name}
          />
        );
      })}
    </Tab.Navigator>
  );
};
export default Home;
