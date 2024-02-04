import React, { PropsWithChildren } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { drawStyles } from './style';
import { View } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type EditLightProps = NativeStackScreenProps<RootStackParamList, 'EditLight'> &
  PropsWithChildren<{ name?: string }>;
const EditLight = (props: EditLightProps) => {
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
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: 'rgba(89,56,236,1)',
      }}>
      <WebView
        source={{ uri: 'http://120.77.9.222/draw' }}
        style={drawStyles.container}
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
export default EditLight;
