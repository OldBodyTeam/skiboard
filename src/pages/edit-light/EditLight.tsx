import React from 'react';
import WebView from 'react-native-webview';
import { drawStyles } from './style';

const EditLight = () => {
  return (
    <WebView
      source={{ uri: 'http://10.3.170.199:5173/draw' }}
      style={drawStyles.container}
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
export default EditLight;
