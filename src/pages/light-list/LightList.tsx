import React, { PropsWithChildren, useRef } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { View } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWebViewUrl } from '@hooks/useWebviewUrl';
import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';
import { Text, TouchableHighlight } from 'react-native';
type LightListProps = NativeStackScreenProps<RootStackParamList, 'LightList'> &
  PropsWithChildren<{ name?: string }>;
const LightList = (props: LightListProps) => {
  const { navigation } = props;
  const handleRoute = (data: { goPage: any; screen: string }) => {
    navigation.navigate(
      data.goPage,
      data.screen ? { screen: data.screen } : {},
    );
  };
  const modalDeleteRef = useRef<BlurModalRef>(null);
  const handleDelete = () => {
    console.log('delete');
  };
  const handleNavigation = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data) as {
      type: 'delete' | 'route';
      route: { goPage: string; screen: string };
    };
    switch (data.type) {
      case 'delete':
        modalDeleteRef.current?.openModal();
        return;
      case 'route':
      default:
        handleRoute(data.route);
    }
    console.log(data);
  };
  const insets = useSafeAreaInsets();
  const uri = useWebViewUrl('draw-list');
  return (
    <View
      style={{
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flex: 1,
        paddingTop: insets.top,
      }}>
      <WebView
        source={{
          uri,
        }}
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: 'rgba(19, 20, 22, 1)',
        }}
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
      <BlurModal
        ref={modalDeleteRef}
        title="Remove Device"
        content="Confirm device removal">
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 12 }}>
          <TouchableHighlight
            style={{ flex: 1 }}
            onPress={() => modalDeleteRef.current?.closeModal()}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{ fontWeight: 'bold', fontSize: 16, color: '#ffffff' }}>
                Cancel
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{ flex: 1 }} onPress={handleDelete}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{ color: '#FCE500', fontWeight: 'bold', fontSize: 16 }}>
                Confirm
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </BlurModal>
    </View>
  );
};
export default LightList;
