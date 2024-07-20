import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import { isAxiosError } from 'axios';
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
} from 'react-native';
import { RootStackParamList } from 'route.config';
import { useToastMessage } from '@hooks/useAxiosError';
type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'> &
  PropsWithChildren<{ name?: string }>;
const Register: FC<RegisterProps> = props => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleAxiosError, toast } = useToastMessage();
  const register = async () => {
    try {
      const client = await ClientRequest();
      await client.authControllerRegister({
        email: email,
        password: password,
        username: username,
      });
      toast('注册成功');
      navigation.navigate('Login');
    } catch (e) {
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
          source={require('../../assets/register/blue.png')}
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
          source={require('../../assets/register/yellow.png')}
        />
        <Text
          style={{
            color: '#FDFDFD',
            fontWeight: 'bold',
            fontSize: 28,
            marginLeft: 28,
          }}>
          {t('register')}
        </Text>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 28 }}>
        <View style={{ marginBottom: 24 }}>
          <View style={{ marginBottom: 7.5 }}>
            <Text style={{ fontSize: 16, color: '#5A5B5C', lineHeight: 19 }}>
              {t('register-user-label')}
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
            placeholder={t('register-user-placeholder')}
            onChangeText={setUsername}
            placeholderTextColor="white"
            autoCapitalize="none"
            keyboardType="default"
          />
        </View>
        <View style={{ marginBottom: 24 }}>
          <View style={{ marginBottom: 7.5 }}>
            <Text style={{ fontSize: 16, color: '#5A5B5C', lineHeight: 19 }}>
              {t('register-email-label')}
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
            placeholder={t('register-email-placeholder')}
            onChangeText={setEmail}
            placeholderTextColor="white"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View>
          <View style={{ marginBottom: 7.5 }}>
            <Text style={{ fontSize: 16, color: '#5A5B5C', lineHeight: 19 }}>
              {t('register-password-label')}
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
            placeholder={t('register-password-placeholder')}
            onChangeText={setPassword}
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
            onPress={register}>
            <Text style={{ fontWeight: '600', color: '#333333', fontSize: 18 }}>
              {t('register')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.push('Login')}
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
              {t('Login')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default Register;
