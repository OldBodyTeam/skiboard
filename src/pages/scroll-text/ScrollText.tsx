import useBLE from '@hooks/useBLE';
import { useWebViewUrl } from '@hooks/useWebviewUrl';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BLEConfig } from '@utils/ble';
import { getHex } from '@utils/hex';
// import { Logger } from '@utils/log';
import { get } from 'lodash';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const handleNavigation = async (event: WebViewMessageEvent) => {
    // console.log('*************', event.nativeEvent.data);
    try {
      const data = JSON.parse(event.nativeEvent.data) as {
        type: 'chooseText' | 'back';
        [p: string]: any;
      };
      // console.log('*************', event.nativeEvent.data);
      switch (data.type) {
        case 'chooseText':
          const text = data.str as string[];
          const covertText = text
            .map(v => get(BLEConfig, `scrollText.${v}`))
            .join('');
          // console.log('*************', text);
          // for await (let str of text) {
          //   //   await bleWrite(
          //   //     BLEConfig.scrollText[
          //   //       str.toLowerCase() as keyof typeof BLEConfig.scrollText
          //   //     ],
          //   //   );
          //   console.log(str);
          // }
          await bleWrite(`57EF${getHex(covertText.length / 2)}${covertText}61`);
          return;
        case 'back':
        default:
          navigation.navigate(
            data.goPage,
            data.screen ? { screen: data.screen } : {},
          );
      }
    } catch (error) {
      Toast.show(t('error'));
      // Logger('scroll text 写入失败');
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
