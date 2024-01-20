import * as React from 'react';
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { TabConfig, TabParamList } from './tab-config';
import CustomTabBar from '@components/custom-tab-bar/CustomTabBar';
import { RootStackParamList } from 'route.config';

const Tab = createBottomTabNavigator<TabParamList>();
type HomeProps = BottomTabScreenProps<RootStackParamList, 'Home'> &
  React.PropsWithChildren<{ name?: string }>;
const Home = (_props: HomeProps) => {
  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={{ headerShown: false }}
      initialRouteName="DesignScreen">
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
