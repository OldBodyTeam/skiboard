import { useWebViewUrl } from '@hooks/useWebviewUrl';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const uri = useWebViewUrl('scroll-text');
  return (
    <View
      style={{
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flex: 1,
        paddingTop: insets.top,
      }}>
      <WebView
        source={{ uri }}
        style={{ flex: 1, backgroundColor: 'rgba(19, 20, 22, 1)' }}
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
    </View>
  );
};
export default ScrollText;
