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
import { LogBox, Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
// import { RecoilRoot } from 'recoil';
import i18next from './src/utils/i18next';
import BackgroundBle from '@components/background-ble/BackgroundBle';

// import { ClientRequest } from '@services/client';
const Stack = createNativeStackNavigator<RootStackParamList>();
LogBox.ignoreLogs([
  '[Reanimated] Reduced motion setting is enabled on this device.',
]);
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
    // <RecoilRoot>
    <BackgroundBle>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootSiblingParent>
          <NavigationContainer
            onReady={() => {
              i18next.then(() => {
                BootSplash.hide({ fade: true });
              });
            }}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="Auth">
              {routeConfig.map(item => (
                <Stack.Screen
                  name={item.name}
                  component={item.component as FunctionComponent}
                  key={item.name}
                  options={
                    item.name === 'Home'
                      ? {
                          gestureEnabled: false,
                        }
                      : {}
                  }
                />
              ))}
            </Stack.Navigator>
          </NavigationContainer>
        </RootSiblingParent>
      </GestureHandlerRootView>
    </BackgroundBle>
    // </RecoilRoot>
  );
}

export default App;

// 57e0900011082838485868788898a8b8c8d8e818365564748393a3a2b2c1d1d0e1e2e3e4e5e6e7e9eaebecedeeefffcfbeaead9d8d8c7c6c5b4b3a2a191726273746566575458595a4b4c4c38494b3d3c2d2d4d5d6c6c7c9cacbccdcdbdad9d7dedfcebdc5b5a5768696a6b6a797877767574766b7b9babbbccdacabaa994939294a5a6b7b8b9b9ca99a8a897969596a7a61
