import React, { PropsWithChildren } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { drawStyles } from './style';
import { SafeAreaView } from 'react-native';
import { View } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
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
  return (
    <View style={{ backgroundColor: 'rgba(89,56,236,1)', flex: 1 }}>
      <SafeAreaView style={drawStyles.container}>
        <WebView
          source={{ uri: 'http://192.168.199.106:5173/draw' }}
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
      </SafeAreaView>
    </View>
  );
};
export default EditLight;
