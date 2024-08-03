import React, { FC, PropsWithChildren, useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import Login from '@pages/login/Login';
import Register from '@pages/register/Register';
import Reset from '@pages/reset/Reset';
import LottieView from 'lottie-react-native';
import { getI18n } from 'react-i18next';
import { useMemoizedFn, useMount } from 'ahooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { ChangeStatus } from './enums';

type EntryProps = NativeStackScreenProps<
  RootStackParamList,
  'Register' | 'Reset' | 'Login'
> &
  PropsWithChildren<{ name?: string }>;
const Entry: FC<EntryProps> = props => {
  const { navigation, route } = props;
  const [changeStatus, setChangeStatus] = useState<ChangeStatus>(
    ChangeStatus.login,
  );
  const [lan, setLanguage] = useState<'zh' | 'en'>('zh');
  useMount(() => {
    const { language } = getI18n();
    setLanguage(language as 'zh' | 'en');
  });
  const changeStatusPage = useMemoizedFn((status: ChangeStatus) => {
    setChangeStatus(status);
  });
  return (
    <View style={{ flex: 1, backgroundColor: '#131416' }}>
      <StatusBar />
      <View style={{ marginBottom: 87.5 }}>
        {changeStatus === ChangeStatus.login ? (
          lan === 'en' ? (
            <Image
              source={require('../../assets/lottie/en-login-static.png')}
              style={{ width: 375, height: 127.5 }}
            />
          ) : (
            <Image
              source={require('../../assets/lottie/zh-login-static.png')}
              style={{ width: 375, height: 127.5 }}
            />
          )
        ) : null}
        {changeStatus === ChangeStatus.login2register ? (
          lan === 'en' ? (
            <LottieView
              source={require('../../assets/lottie/en2login2register.json')}
              style={{ width: 375, height: 127.5 }}
              autoPlay
              loop={false}
            />
          ) : (
            <LottieView
              source={require('../../assets/lottie/zh2login2reighster.json')}
              style={{ width: 375, height: 127.5 }}
              autoPlay
              loop={false}
            />
          )
        ) : null}
        {changeStatus === ChangeStatus.login2reset ? (
          lan === 'en' ? (
            <LottieView
              source={require('../../assets/lottie/en2login2reset.json')}
              style={{ width: 375, height: 127.5 }}
              autoPlay
              loop={false}
            />
          ) : (
            <LottieView
              source={require('../../assets/lottie/login2reset2chinese.json')}
              style={{ width: 375, height: 127.5 }}
              autoPlay
              loop={false}
            />
          )
        ) : null}
        {changeStatus === ChangeStatus.register2login ? (
          lan === 'en' ? (
            <LottieView
              source={require('../../assets/lottie/en2register2login.json')}
              style={{ width: 375, height: 127.5 }}
              autoPlay
              loop={false}
            />
          ) : (
            <LottieView
              source={require('../../assets/lottie/zh2register2login.json')}
              style={{ width: 375, height: 127.5 }}
              autoPlay
              loop={false}
            />
          )
        ) : null}
        {changeStatus === ChangeStatus.reset2login ? (
          lan === 'en' ? (
            <LottieView
              source={require('../../assets/lottie/en2reset2login.json')}
              style={{ width: 375, height: 127.5 }}
              autoPlay
              loop={false}
            />
          ) : (
            <LottieView
              source={require('../../assets/lottie/zh2reset2login.json')}
              style={{ width: 375, height: 127.5 }}
              autoPlay
              loop={false}
            />
          )
        ) : null}
      </View>
      {changeStatus === ChangeStatus.login ||
      changeStatus === ChangeStatus.register2login ||
      changeStatus === ChangeStatus.reset2login ? (
        <Login
          navigation={navigation}
          route={route}
          changeStatus={changeStatusPage}
        />
      ) : null}
      {changeStatus === ChangeStatus.login2register ||
      changeStatus === ChangeStatus.reset2register ? (
        <Register
          navigation={navigation}
          route={route}
          changeStatus={changeStatusPage}
        />
      ) : null}
      {changeStatus === ChangeStatus.register2reset ||
      changeStatus === ChangeStatus.login2reset ? (
        <Reset
          navigation={navigation}
          route={route}
          changeStatus={changeStatusPage}
        />
      ) : null}
    </View>
  );
};
export default Entry;
