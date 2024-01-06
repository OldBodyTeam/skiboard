import React from 'react';
import { WebView } from 'react-native-webview';
const Register = () => {
  return (
    <WebView
      source={{ uri: 'http://10.255.177.255:5173/index.html' }}
      style={{ flex: 1 }}
      originWhitelist={['*']}
      scalesPageToFit={false}
      javaScriptEnabled
      useWebView2
      mixedContentMode="compatibility"
      cacheMode="LOAD_NO_CACHE"
    />
  );
};
export default Register;
