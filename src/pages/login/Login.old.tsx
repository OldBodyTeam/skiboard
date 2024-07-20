import React, { PropsWithChildren } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { loginStyles } from './style';
import { RootStackParamList } from 'route.config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import Toast from 'react-native-root-toast';
import { isAxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecoilState } from 'recoil';
import { userInfoState } from '@stores/login/login.atom';
import { useWebViewUrl } from '@hooks/useWebviewUrl';
type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'> &
  PropsWithChildren<{ name?: string }>;
type Params = {
  usernameOrEmail: string;
  password: string;
  type: 'route' | 'request';
  goPage: string;
};
const Login = (props: LoginProps) => {
  const { navigation } = props;
  const [_, setUserInfo] = useRecoilState(userInfoState);
  const getUserInfo = async (userId: string) => {
    const client = await ClientRequest();
    const { data } = await client.userControllerUser(userId);
    setUserInfo(data.data);
  };
  const login = async (params: Omit<Params, 'type' | 'goPage'>) => {
    try {
      const client = await ClientRequest();
      const requestData = await client.authControllerLogin({
        email_name: params.usernameOrEmail,
        password: params.password,
      });
      const token = requestData.data.data?.access_token ?? '';
      await AsyncStorage.setItem('access_token', token);
      await getUserInfo(requestData.data.data?.userId ?? '');
      Toast.show('登录成功', {
        position: Toast.positions.CENTER,
        delay: 0,
        animation: true,
        duration: Toast.durations.SHORT,
      });
      navigation.push('BleManager');
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(JSON.stringify(e));
      }
      Toast.show('登录失败', {
        position: Toast.positions.CENTER,
        delay: 0,
        animation: true,
        duration: Toast.durations.SHORT,
      });
    }
  };
  const goRegisterPage = (data: any) => {
    navigation.push(data.goPage);
  };
  const handleNavigation = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data) as Params;
    switch (data.type) {
      case 'request':
        login(data);
        return;
      case 'route':
      default:
        goRegisterPage(data);
    }
  };
  const uri = useWebViewUrl('login');
  return (
    <WebView
      source={{
        uri,
      }}
      style={loginStyles.container}
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
  );
};
export default Login;
