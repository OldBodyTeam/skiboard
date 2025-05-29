/* eslint-disable react-hooks/exhaustive-deps */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import { deviceInfoState } from '@stores/device/device.atom';
import { userInfoState } from '@stores/login/login.atom';
import { useAtom, useSetAtom } from 'jotai';
import React, { PropsWithChildren, useEffect } from 'react';
import { Image, View } from 'react-native';
// import { useRecoilState } from 'recoil';
import { RootStackParamList } from 'route.config';
type AuthProps = NativeStackScreenProps<RootStackParamList, 'Register'> &
  PropsWithChildren<{ name?: string }>;
const Auth = (props: AuthProps) => {
  const { navigation } = props;
  const setUserInfo = useSetAtom(userInfoState);
  const [deviceInfo] = useAtom(deviceInfoState);
  useEffect(() => {
    const handleAutoLogin = async () => {
      try {
        const client = await ClientRequest();
        const data = await client.authControllerGetProfile();
        const userId = (data.data as any).data.sub;
        const userInfoData = await client.userControllerUser(userId);
        setUserInfo(userInfoData.data.data);
        console.log('userInfoData', userInfoData.data.data);
        if (deviceInfo.connected) {
          navigation.push('Home', { screen: 'DesignScreen' });
        } else {
          __DEV__
            ? navigation.push('Home', { screen: 'DesignScreen' })
            : navigation.push('BleManager');
          // navigation.push('BleManager');
        }
      } catch (e) {
        console.log(e);
        navigation.push('Login');
      }
    };
    handleAutoLogin();
  }, [navigation, setUserInfo]);
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        // backgroundColor: '#131416',
      }}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
};
export default Auth;
