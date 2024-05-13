import React, { PropsWithChildren } from 'react';
// import { Button, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import type { PropsWithChildren } from 'react';
import { registerStyles } from './style';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { RootStackParamList } from 'route.config';
import { ClientRequest } from '@services/client';
import Toast from 'react-native-root-toast';
import { isAxiosError } from 'axios';
import { useWebViewUrl } from '@hooks/useWebviewUrl';
type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'> &
  PropsWithChildren<{ name?: string }>;
type Params = {
  username: string;
  password: string;
  type: 'route' | 'request';
  goPage: string;
  email: string;
};
const Register = (props: RegisterProps) => {
  const { navigation } = props;
  const goLoginPage = () => {
    navigation.navigate('Login');
  };
  const register = async (params: Omit<Params, 'type' | 'goPage'>) => {
    console.log('params', params);
    try {
      const client = await ClientRequest();
      await client.authControllerRegister({
        email: params.email,
        password: params.password,
        username: params.username,
      });
      goLoginPage();
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(JSON.stringify(e.message));
      }
      Toast.show('注册失败', {
        position: Toast.positions.CENTER,
        delay: 0,
        animation: true,
        duration: Toast.durations.SHORT,
      });
    }
  };
  const handleNavigation = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data) as Params;
    switch (data.type) {
      case 'request':
        register(data);
        return;
      case 'route':
      default:
        goLoginPage();
    }
  };
  const uri = useWebViewUrl('register');
  console.log(uri);
  return (
    <WebView
      source={{
        uri,
      }}
      style={registerStyles.container}
      originWhitelist={['*']}
      scalesPageToFit={false}
      javaScriptEnabled
      javaScriptEnabledAndroid
      useWebView2
      mixedContentMode="compatibility"
      cacheMode="LOAD_NO_CACHE"
      scrollEnabled={false}
      hideKeyboardAccessoryView
      onMessage={handleNavigation}
    />
  );
};
export default Register;
