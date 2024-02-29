/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { FunctionComponent, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { RootStackParamList, routeConfig } from './route.config';
import { Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import { RecoilRoot } from 'recoil';
// import { ClientRequest } from '@services/client';
const Stack = createNativeStackNavigator<RootStackParamList>();
function App(): React.JSX.Element {
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    // const init = async () => {
    //   // async () => {};
    // };
    // init().finally(async () => {
    //   await BootSplash.hide({ fade: true });
    //   console.debug('BootSplash has been hidden successfully');
    // });
  }, []);

  return (
    <RecoilRoot>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootSiblingParent>
          <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="Auth">
              {routeConfig.map(item => (
                <Stack.Screen
                  name={item.name}
                  component={item.component as FunctionComponent}
                  key={item.name}
                />
              ))}
            </Stack.Navigator>
          </NavigationContainer>
        </RootSiblingParent>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
}

export default App;
