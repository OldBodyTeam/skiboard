import React, { PropsWithChildren } from 'react';
// import { Button, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import type { PropsWithChildren } from 'react';
import { registerStyles } from './style';
import WebView from 'react-native-webview';
import { RootStackParamList } from 'route.config';
type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'> &
  PropsWithChildren<{ name?: string }>;
const Register = (props: RegisterProps) => {
  const { navigation } = props;
  const handleNavigation = () => {
    navigation.navigate('Login');
  };
  return (
    <WebView
      source={{ uri: 'http://120.77.9.222/register' }}
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
    />
  );
};
export default Register;
