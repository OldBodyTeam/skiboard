import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import React, { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { RootStackParamList } from 'route.config';
import { useToastMessage } from '@hooks/useAxiosError';
import { ChangeStatus } from '@pages/entry/enums';
type RegisterProps = NativeStackScreenProps<
  RootStackParamList,
  'Register' | 'Reset' | 'Login'
> &
  PropsWithChildren<{ changeStatus: (status: ChangeStatus) => void }>;
const Register: FC<RegisterProps> = props => {
  const { navigation, changeStatus } = props;
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
            onPress={() => changeStatus(ChangeStatus.register2login)}
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
