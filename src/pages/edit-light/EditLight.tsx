import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import WebView, {
  WebViewMessageEvent,
  WebViewProps,
} from 'react-native-webview';
import { drawStyles } from './style';
import { View } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Text, TextInput } from 'react-native';
import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';

type EditLightProps = NativeStackScreenProps<RootStackParamList, 'EditLight'> &
  PropsWithChildren<{ name?: string }>;
const EditLight = (props: EditLightProps) => {
  const modalEditRef = useRef<BlurModalRef>(null);
  const { navigation } = props;
  const handleNavigation = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log(data);
    if (data.openModal) {
      modalEditRef.current?.openModal();
    } else {
      navigation.navigate(
        data.goPage,
        data.screen ? { screen: data.screen } : {},
      );
    }
  };
  const insets = useSafeAreaInsets();
  const handleEdit = () => {
    modalEditRef.current?.closeModal();
    const code = `
      window.getDrawTitle(${title});
      `;
    setTimeout(() => {
      webRef.current?.injectJavaScript(code);
    }, 1000);
  };
  const webRef = useRef<any>(null);
  const [title, setTitle] = useState('Smiling Face');
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
        ref={webRef}
        javaScriptEnabledAndroid
        injectedJavaScriptBeforeContentLoaded={`window.getDrawTitle(${title});`}
      />
      <BlurModal
        ref={modalEditRef}
        title="Rename"
        content="Change Custom Name"
        mode="light">
        <View style={{ display: 'flex', marginTop: 8, width: '100%' }}>
          <View style={{ paddingLeft: 21, paddingRight: 21, width: '100%' }}>
            <TextInput
              placeholder="Change Custom Name"
              style={{
                height: 36,
                backgroundColor: 'rgba(245, 245, 245, 1)',
                borderRadius: 8,
                width: '100%',
                paddingLeft: 12,
                paddingRight: 12,
                color: 'rgba(195, 196, 198, 1)',
              }}
              onChange={e => setTitle(e.nativeEvent.text)}
            />
          </View>
          <Pressable style={{ flex: 1, marginTop: 12 }} onPress={handleEdit}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{
                  color: 'rgba(89, 56, 236, 1)',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                Confirm
              </Text>
            </View>
          </Pressable>
        </View>
      </BlurModal>
    </View>
  );
};
export default EditLight;
