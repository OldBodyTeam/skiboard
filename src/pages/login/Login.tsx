import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import { userInfoState } from '@stores/login/login.atom';
import React, { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  StatusBar,
  Image,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRecoilState } from 'recoil';
import { RootStackParamList } from 'route.config';
import Toast from 'react-native-root-toast';
import { useToastMessage } from '@hooks/useAxiosError';
type LoginProps = NativeStackScreenProps<RootStackParamList, 'Register'> &
  PropsWithChildren<{ name?: string }>;

const Login: FC<LoginProps> = props => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [passwordOne, setPasswordOne] = useState('');
  const [_, setUserInfo] = useRecoilState(userInfoState);
  const { handleAxiosError, toast } = useToastMessage();
  const getUserInfo = async (userId: string) => {
    const client = await ClientRequest();
    const { data } = await client.userControllerUser(userId);
    setUserInfo(data.data);
  };
  const login = async () => {
    try {
      const client = await ClientRequest();
      const requestData = await client.authControllerLogin({
        email_name: email,
        password: passwordOne,
      });
      const token = requestData.data.data?.access_token ?? '';
      await AsyncStorage.setItem('access_token', token);
      await getUserInfo(requestData.data.data?.userId ?? '');
      toast('登录成功');
      navigation.push('BleManager');
    } catch (e: unknown) {
      handleAxiosError(e);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#131416' }}>
      <StatusBar />
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: 127.5,
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 87.5,
        }}>
        <Image
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: -1,
            width: 215,
            height: 127.5,
          }}
          source={require('../../assets/login/yellow.png')}
        />
        <Image
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: -2,
            width: 290,
            height: 107.5,
          }}
          source={require('../../assets/login/blue.png')}
        />
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 28,
            marginLeft: 28,
          }}>
          {t('Login')}
        </Text>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 28 }}>
        <View style={{ marginBottom: 24 }}>
          <View style={{ marginBottom: 7.5 }}>
            <Text style={{ fontSize: 16, color: '#5A5B5C', lineHeight: 19 }}>
              {t('login-user-label')}
            </Text>
          </View>
          <TextInput
            style={{
              paddingVertical: 16.5,
              fontSize: 20,
              color: 'white',
              borderBottomColor: '#5A5B5C',
              borderBottomWidth: 1,
              borderStyle: 'solid',
            }}
            placeholder={t('login-user-placeholder')}
            onChangeText={setEmail}
            placeholderTextColor="white"
            autoCapitalize="none"
          />
        </View>
        <View style={{ marginBottom: 24 }}>
          <View style={{ marginBottom: 7.5 }}>
            <Text style={{ fontSize: 16, color: '#5A5B5C', lineHeight: 19 }}>
              {t('login-password-label')}
            </Text>
          </View>
          <TextInput
            style={{
              paddingVertical: 16.5,
              fontSize: 20,
              color: 'white',
              borderBottomColor: '#5A5B5C',
              borderBottomWidth: 1,
              borderStyle: 'solid',
            }}
            placeholder={t('login-password-placeholder')}
            onChangeText={setPasswordOne}
            placeholderTextColor="white"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View style={{ marginTop: 60 }}>
          <TouchableOpacity
            style={{
              height: 60,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FDDE31',
              borderRadius: 9999,
            }}
            onPress={login}>
            <Text style={{ fontWeight: '600', color: '#333333', fontSize: 18 }}>
              {t('Login')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.push('Register')}
            style={{
              height: 60,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 9999,
              borderColor: '#FDDE31',
              borderWidth: 1,
              borderStyle: 'solid',
            }}>
            <Text style={{ fontWeight: '600', color: '#FDDE31', fontSize: 18 }}>
              {t('register')}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableWithoutFeedback onPress={() => navigation.push('Reset')}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text style={{ color: 'white' }}>{t('forget')}</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};
export default Login;
