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
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
// ScrollView,
// StatusBar,
// StyleSheet,
// Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
// DebugInstructions,
// Header,
// LearnMoreLinks,
// ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
import Login from '@pages/login/Login';
// import { Text, View } from 'react-native';
import Register from '@pages/register/Register';
import BleManager from '@pages/ble-manager/BleManager';
import { Platform, StatusBar } from 'react-native';
import ColorPickerPage from '@pages/color-picker/ColorPicker';
// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }
const Stack = createNativeStackNavigator();
function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.blue,
  // };
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
        screenOptions={{ headerShown: false }}
        initialRouteName="ColorPickerPage">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="BleManager" component={BleManager} />
        <Stack.Screen name="ColorPickerPage" component={ColorPickerPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
