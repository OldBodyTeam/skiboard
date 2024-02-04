import React, { PropsWithChildren } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { loginStyles } from './style';
import { RootStackParamList } from 'route.config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'> &
  PropsWithChildren<{ name?: string }>;
const Login = (props: LoginProps) => {
  const { navigation } = props;
  const handleNavigation = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    navigation.navigate(data.goPage);
  };
  return (
    <WebView
      source={{ uri: 'http://120.77.9.222/login' }}
      style={loginStyles.container}
      originWhitelist={['*']}
      scalesPageToFit={false}
      javaScriptEnabled
      useWebView2
      mixedContentMode="compatibility"
      cacheMode="LOAD_NO_CACHE"
      scrollEnabled={false}
      hideKeyboardAccessoryView
      onMessage={handleNavigation}
    />
  );
};
export default Login;
