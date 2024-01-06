import React from 'react';
import WebView from 'react-native-webview';
import { loginStyles } from './style';

const Login = () => {
  return (
    <WebView
      source={{ uri: 'http://10.255.177.255:5173/login' }}
      style={loginStyles.container}
      originWhitelist={['*']}
      scalesPageToFit={false}
      javaScriptEnabled
      useWebView2
      mixedContentMode="compatibility"
      cacheMode="LOAD_NO_CACHE"
      scrollEnabled={false}
      hideKeyboardAccessoryView
    />
  );
};
export default Login;
