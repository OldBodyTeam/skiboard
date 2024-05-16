import React, {
  PropsWithChildren,
  useEffect,
  // useEffect,
  // useMemo,
  useRef,
  useState,
} from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { drawStyles } from './style';
import { View } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Text, TextInput } from 'react-native';
import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';
import { useWebViewUrl } from '@hooks/useWebviewUrl';
import { ClientRequest } from '@services/client';
import { useRecoilState } from 'recoil';
import { userInfoState } from '@stores/login/login.atom';
import useToast from '@hooks/useToast';
import { useMemoizedFn } from 'ahooks';
import useBLE from '@hooks/useBLE';
import { BLEConfig } from '@utils/ble';
import { editLight } from '@config/edit-light';
type EditLightProps = NativeStackScreenProps<RootStackParamList, 'EditLight'> &
  PropsWithChildren<{ name?: string }>;
const EditLight = (props: EditLightProps) => {
  const modalEditRef = useRef<BlurModalRef>(null);
  const [userInfo] = useRecoilState(userInfoState);
  const { navigation, route } = props;
  const { bleWrite } = useBLE();
  const { collectionId } = route.params || {};
  const showToast = useToast();
  const createCollection = async (data: {
    name: string;
    serverData: { selected: boolean; frame: number[][] };
  }) => {
    try {
      const client = await ClientRequest();
      client.collectionControllerCreate(userInfo?.id ?? '', {
        name: data.name,
        frameList: JSON.stringify(data.serverData) as any,
      });
      navigation.push('LightList');
      showToast('创建成功');
    } catch (e) {
      showToast('创建失败');
    }
  };
  const updateCollection = async (data: {
    name: string;
    serverData?: { selected: boolean; frame: number[][] };
  }) => {
    try {
      const client = await ClientRequest();
      await client.collectionControllerModifyCollection(
        collectionId,
        Object.assign(
          {
            name: data.name,
          },
          data?.serverData
            ? { frameList: JSON.stringify(data.serverData) as any }
            : undefined,
        ),
      );
      navigation.push('LightList');
      showToast('更新成功');
    } catch (e) {
      showToast('更新失败');
    }
  };
  const deleteFrameInCollection = async (data: { frameIndex: number }) => {
    try {
      const client = await ClientRequest();
      await client.collectionControllerDeleteFrameList(collectionId, {
        position: data.frameIndex,
      });
      showToast('删除成功');
    } catch (e) {
      showToast('删除失败');
    }
  };
  const copyFrameInCollection = async (data: { frameIndex: number }) => {
    const client = await ClientRequest();
    await client.collectionControllerCopyFrameItem(collectionId, {
      position: data.frameIndex,
    });
  };
  const handlePlayDrawSpeed = useMemoizedFn((data: { speed: number }) => {
    const { speed } = data;
    bleWrite(BLEConfig.editLight[speed as keyof typeof editLight]);
  });
  const handleNavigation = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data) as {
      type:
        | 'create-collection'
        | 'route'
        | 'modify-name'
        | 'delete-frame'
        | 'copy-frame'
        | 'speed';
      [p: string]: any;
    };
    console.log(data);

    switch (data.type) {
      case 'create-collection':
        collectionId
          ? updateCollection(data as any)
          : createCollection(data as any);
        return;
      case 'modify-name':
        modalEditRef.current?.openModal();
        return;
      case 'delete-frame':
        collectionId ? deleteFrameInCollection(data as any) : undefined;
        return;
      case 'copy-frame':
        collectionId ? copyFrameInCollection(data as any) : undefined;
        return;
      case 'speed':
        handlePlayDrawSpeed(data);
        return;
      case 'route':
      default:
        navigation.navigate(
          data.goPage,
          data.screen ? { screen: data.screen } : {},
        );
    }
  };
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('Smiling Face');
  const handleEdit = async () => {
    modalEditRef.current?.closeModal();
    if (collectionId) {
      // 编辑场景
      const client = await ClientRequest();
      await client.collectionControllerModifyCollection(collectionId, {
        name: title,
      });
    }
    const buildPostData = {
      type: 'modifyCollectionName',
      webData: { name: title },
    };
    setTimeout(() => {
      const injected = `
        window.postMessage(${JSON.stringify(buildPostData)}, window.origin);
        true;
      `;
      webRef.current?.injectJavaScript(injected);
    }, 1000);

    // await
  };
  const webRef = useRef<any>(null);
  const uri = useWebViewUrl('draw');
  const getCollection = async () => {
    try {
      const client = await ClientRequest();
      const responseData = await client.collectionControllerGetCollectionDetail(
        collectionId,
      );
      const collectionDetail = responseData.data.data;
      const buildPostData = {
        type: 'setCollectionDetail',
        webData: collectionDetail,
      };
      setTimeout(() => {
        const injected = `
          window.postMessage(${JSON.stringify(buildPostData)}, window.origin);
          true;
        `;
        webRef.current?.injectJavaScript(injected);
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (collectionId) {
      getCollection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);
  // 直接
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: 'rgba(89,56,236,1)',
      }}>
      <WebView
        source={{ uri }}
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
        // javaScriptEnabledAndroid
        // injectedJavaScriptBeforeContentLoaded={`window.getDrawTitle(${title});`}
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
