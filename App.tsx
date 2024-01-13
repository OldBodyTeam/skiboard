/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { RootStackParamList, routeConfig } from './route.config';
import { Platform, StatusBar } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
function App(): React.JSX.Element {
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
    const init = async () => {
      // …do multiple sync or async tasks
    };
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.debug('BootSplash has been hidden successfully');
    });
  }, []);

  return (
    <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'none' }}
        initialRouteName="DeviceList">
        {routeConfig.map(item => (
          <Stack.Screen
            name={item.name}
            component={item.component}
            key={item.name}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
