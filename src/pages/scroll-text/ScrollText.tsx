import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { PropsWithChildren } from 'react';
import { SafeAreaView, View } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { RootStackParamList } from 'route.config';
type ScrollTextProps = NativeStackScreenProps<
  RootStackParamList,
  'ScrollText'
> &
  PropsWithChildren<{ name?: string }>;
const ScrollText = (props: ScrollTextProps) => {
  const { navigation } = props;
  const handleNavigation = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log(data);
    navigation.navigate(
      data.goPage,
      data.screen ? { screen: data.screen } : {},
    );
  };
  return (
    <View style={{ backgroundColor: 'rgba(19, 20, 22, 1)', flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: 'http://120.77.9.222/scroll-text' }}
          style={{ flex: 1 }}
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
      </SafeAreaView>
    </View>
  );
};
export default ScrollText;
