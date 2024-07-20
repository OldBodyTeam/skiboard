import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import { deviceInfoState } from '@stores/device/device.atom';
import { userInfoState } from '@stores/login/login.atom';
import React, { PropsWithChildren, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { RootStackParamList } from 'route.config';
type AuthProps = NativeStackScreenProps<RootStackParamList, 'Register'> &
  PropsWithChildren<{ name?: string }>;
const Auth = (props: AuthProps) => {
  const { navigation } = props;
  const [_, setUserInfo] = useRecoilState(userInfoState);
  const [deviceInfo] = useRecoilState(deviceInfoState);
  useEffect(() => {
    const handleAutoLogin = async () => {
      try {
        const client = await ClientRequest();
        const data = await client.authControllerGetProfile();
        const userId = (data.data as any).data.sub;
        const userInfoData = await client.userControllerUser(userId);
        setUserInfo(userInfoData.data.data);
        if (deviceInfo.connected) {
          navigation.push('Home', { screen: 'DesignScreen' });
        } else {
          __DEV__
            ? navigation.push('Home', { screen: 'DesignScreen' })
            : navigation.push('BleManager');
        }
      } catch (e) {
        console.log(e);
        navigation.push('Login');
      }
    };
    handleAutoLogin();
  }, [deviceInfo.connected, navigation, setUserInfo]);
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>权限请求中</Text>
    </View>
  );
};
export default Auth;
