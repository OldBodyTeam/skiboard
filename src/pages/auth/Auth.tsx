import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import { userInfoState } from '@stores/login/login.atom';
import React, { PropsWithChildren, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { RootStackParamList } from 'route.config';
type AuthProps = NativeStackScreenProps<RootStackParamList, 'Register'> &
  PropsWithChildren<{ name?: string }>;
const Auth = (props: AuthProps) => {
  const { navigation } = props;
  const [_, setUserInfo] = useRecoilState(userInfoState);
  useEffect(() => {
    const handleAutoLogin = async () => {
      try {
        const client = await ClientRequest();
        const data = await client.authControllerGetProfile();
        const userId = (data.data as any).data.sub;
        const userInfoData = await client.userControllerUser(userId);
        setUserInfo(userInfoData.data.data);
        navigation.replace('Home', { screen: 'DesignScreen' });
      } catch (e) {
        navigation.replace('Login');
      }
    };
    handleAutoLogin();
  }, [navigation, setUserInfo]);
  return <></>;
};
export default Auth;
