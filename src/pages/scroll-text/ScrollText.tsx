import useBLE from '@hooks/useBLE';
import { useWebViewUrl } from '@hooks/useWebviewUrl';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BLEConfig } from '@utils/ble';
import { Logger } from '@utils/log';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-root-toast';
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
  const { bleWrite } = useBLE();
  const handleNavigation = async (event: WebViewMessageEvent) => {
    console.log('*************', event.nativeEvent.data);
    try {
      const data = JSON.parse(event.nativeEvent.data) as {
        type: 'chooseText' | 'back';
        [p: string]: any;
      };
      console.log('*************', event.nativeEvent.data);
      switch (data.type) {
        case 'chooseText':
          const text = data.str as string[];
          console.log('*************', text);
          // for await (let str of text) {
          //   await bleWrite(
          //     BLEConfig.scrollText[
          //       str.toLowerCase() as keyof typeof BLEConfig.scrollText
          //     ],
          //   );
          // }
          console.log(
            '57 e0 2b e1 e2 e3 e4 e5 e6 e7 e8 e9 ea eb ec ed ee ef d0 ff c1 cf b2 be A2 AE 93 9D 83 8D 7C 74 6C 64 5B 55 4b  45 3A 36 2A 26 19 17 08 61'.trim(),
          );
          await bleWrite(
            '57 e0 2b e1 e2 e3 e4 e5 e6 e7 e8 e9 ea eb ec ed ee ef d0 ff c1 cf b2 be A2 AE 93 9D 83 8D 7C 74 6C 64 5B 55 4b  45 3A 36 2A 26 19 17 08 61'.replaceAll(
              ' ',
              '',
            ),
          );
          return;
        case 'back':
        default:
          navigation.navigate(
            data.goPage,
            data.screen ? { screen: data.screen } : {},
          );
      }
    } catch (error) {
      Toast.show('写入失败');
      Logger('scroll text 写入失败');
    }
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
