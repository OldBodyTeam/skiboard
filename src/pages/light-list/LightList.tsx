import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { View } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWebViewUrl } from '@hooks/useWebviewUrl';
import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';
import { ScrollView, Text, TouchableHighlight } from 'react-native';
import { ClientRequest } from '@services/client';
import { useRecoilState } from 'recoil';
import { userInfoState } from '@stores/login/login.atom';
// import { createWebView, useBridge } from '@webview-bridge/react-native';
import { appBridge } from '@pages/edit-light/utils';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';
// import { WebViewMessageEvent } from 'react-native-webview';
// export const { WebView } = createWebView({
//   bridge: appBridge,
//   debug: true, // Enable console.log visibility in the native WebView
// });
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
  const insets = useSafeAreaInsets();
  const uri = useWebViewUrl('draw-list');
  const [userInfo] = useRecoilState(userInfoState);
  const webRef = useRef<any>(null);
  const modalDeleteRef = useRef<BlurModalRef>(null);
  const getCollectionList = async () => {
    try {
      const client = await ClientRequest();
      const responseData = await client.collectionControllerGetCollectionList(
        userInfo?.id ?? '',
      );
      const collection = responseData.data.data;
      const buildPostData = {
        type: 'setCollection',
        webData: collection,
      };
      setTimeout(() => {
        const injected = `
          window.postMessage(${JSON.stringify(buildPostData)}, window.origin);
          true;
        `;
        webRef.current?.injectJavaScript(injected);
      }, 1000);
    } catch (e) {
      Toast.show(`${(e as Error).message}`);
    }
  };
  const [deleteInfo, setDeleteInfo] = useState<{
    collectionId: string;
    frameIndex: number;
  }>();
  const handleDelete = async () => {
    try {
      const client = await ClientRequest();
      await client.collectionControllerDeleteCollection(
        deleteInfo?.collectionId ?? '',
      );
      await getCollectionList();
      modalDeleteRef.current?.closeModal();
    } catch (e) {}
  };
  const handleNavigation = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data) as {
      type: 'delete' | 'route' | 'go-detail';
      route: { goPage: string; screen: string };
      deleteInfo: { collectionId: string; frameIndex: number };
      collectionId: string;
    };
    switch (data.type) {
      case 'go-detail':
        navigation.push('EditLight', { collectionId: data.collectionId });
        return;
      case 'delete':
        modalDeleteRef.current?.openModal();
        setDeleteInfo(data.deleteInfo);
        return;
      case 'route':
      default:
        handleRoute(data.route);
    }
    console.log(data);
  };

  // const { setCollectionInfo } = useBridge(appBridge);
  // const handleEdit = () => {
  //   modalEditRef.current?.closeModal();
  //   const code = `
  //     window.getDrawTitle(${title});
  //     `;
  //   setTimeout(() => {
  //     webRef.current?.injectJavaScript(code);
  //   }, 1000);
  // };
  // const [collectionList, setCollectionList] = useState<string>('');
  useEffect(() => {
    getCollectionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { t } = useTranslation();
  return (
    <View
      style={{
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flex: 1,
        paddingTop: insets.top,
      }}>
      {/* <ScrollView style={{ flex: 1 }}> */}
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
        ref={webRef}
        javaScriptEnabledAndroid
        // javaScriptEnabled
        // javaScriptEnabledAndroid
        // injectedJavaScriptObject={{ collectionList }}
        // injectedJavaScriptBeforeContentLoaded={`window.getCollectionList(${collectionList});true;`}
      />
      {/* </ScrollView> */}

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
                {t('cancel')}
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
                {t('confirm')}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </BlurModal>
    </View>
  );
};
export default LightList;
