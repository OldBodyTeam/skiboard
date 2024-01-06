import React from 'react';
// import { Button, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import type { PropsWithChildren } from 'react';
import { registerStyles } from './style';
import WebView from 'react-native-webview';
const Register = (props: NativeStackScreenProps<any>) => {
  const { navigation } = props;
  const handleNavigation = () => {
    console.debug('get webview info');
    navigation.navigate('Login');
  };
  return (
    // <View style={registerStyles.container}>
    //   <View style={registerStyles.form}>
    //     <View style={registerStyles.labelItem}>
    //       <Text style={registerStyles.labelItemText}>Username/email</Text>
    //       <TextInput style={registerStyles.labelItemInput} />
    //     </View>
    //     <View style={registerStyles.labelItem}>
    //       <Text style={registerStyles.labelItemText}>Password</Text>
    //       <TextInput style={registerStyles.labelItemInput} secureTextEntry />
    //     </View>
    //     <Button color="#007AFF" title="Login" />
    //   </View>
    // </View>
    <WebView
      source={{ uri: 'http://10.255.177.255:5173/register' }}
      style={registerStyles.container}
      originWhitelist={['*']}
      scalesPageToFit={false}
      javaScriptEnabled
      javaScriptEnabledAndroid
      useWebView2
      mixedContentMode="compatibility"
      cacheMode="LOAD_NO_CACHE"
      scrollEnabled={false}
      hideKeyboardAccessoryView
      onMessage={handleNavigation}
      postMessage={handleNavigation}
      // automaticallyAdjustContentInsets={false}
    />
  );
};
export default Register;
