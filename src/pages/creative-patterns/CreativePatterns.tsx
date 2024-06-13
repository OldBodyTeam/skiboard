import React, { PropsWithChildren, useEffect, useRef } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { View } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWebViewUrl } from '@hooks/useWebviewUrl';
import { ClientRequest } from '@services/client';
import Toast from 'react-native-root-toast';

type CreativePatternsProps = NativeStackScreenProps<
  RootStackParamList,
  'LightList'
> &
  PropsWithChildren<{ name?: string }>;

const CreativePatterns = (props: CreativePatternsProps) => {
  const { navigation } = props;
  const handleRoute = (data: { goPage: any; screen: string }) => {
    navigation.navigate(
      data.goPage,
      data.screen ? { screen: data.screen } : {},
    );
  };
  const insets = useSafeAreaInsets();
  const uri = useWebViewUrl('creative-patterns');
  const webRef = useRef<any>(null);
  const getCollectionList = async () => {
    try {
      const client = await ClientRequest();
      const responseData =
        await client.collectionControllerGetCollectionAllList({
          pageSize: 1,
          pageNumber: 100,
        });
      const collection = responseData.data.data.data;
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
      }, 1400);
    } catch (e) {
      Toast.show((e as Error).message);
      console.log(e);
    }
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
        // 业务流程处理
        // navigation.push('EditLight', { collectionId: data.collectionId });
        return;
      case 'route':
      default:
        handleRoute(data.route);
    }
    console.log(data);
  };

  useEffect(() => {
    getCollectionList();
  }, []);
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
        ref={webRef}
        javaScriptEnabledAndroid
      />
    </View>
  );
};
export default CreativePatterns;
