import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { ClientRequest } from '@services/client';
import Toast from 'react-native-root-toast';
import { ChangeStatus } from '@pages/entry/enums';
type ResetProps = NativeStackScreenProps<
  RootStackParamList,
  'Register' | 'Reset' | 'Login'
> &
  PropsWithChildren<{ changeStatus: (status: ChangeStatus) => void }>;
const Reset: FC<ResetProps> = props => {
  const { navigation, changeStatus } = props;
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const reset = async () => {
    try {
      const client = await ClientRequest();
      await client.authControllerModifyPassword({
        email,
        passwordOne,
        passwordTwo,
      });
      Toast.show('修改密码成功');
    } catch (e) {
      Toast.show('重置密码失败');
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#131416' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 28 }}>
        <View style={{ marginBottom: 24 }}>
          <View style={{ marginBottom: 7.5 }}>
            <Text style={{ fontSize: 16, color: '#5A5B5C', lineHeight: 19 }}>
              {t('Email')}
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
            placeholder={t('email-placeholder')}
            onChangeText={setEmail}
            placeholderTextColor="white"
            autoCapitalize="none"
          />
        </View>
        <View style={{ marginBottom: 24 }}>
          <View style={{ marginBottom: 7.5 }}>
            <Text style={{ fontSize: 16, color: '#5A5B5C', lineHeight: 19 }}>
              {t('New Password')}
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
            placeholder={t('new-password-placeholder')}
            onChangeText={setPasswordOne}
            placeholderTextColor="white"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View>
          <View style={{ marginBottom: 7.5 }}>
            <Text style={{ fontSize: 16, color: '#5A5B5C', lineHeight: 19 }}>
              {t('Confirm New Password')}
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
            placeholder={t('confirm-password-placeholder')}
            onChangeText={setPasswordTwo}
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
            onPress={reset}>
            <Text style={{ fontWeight: '600', color: '#333333', fontSize: 18 }}>
              {t('Change Password')}
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
export default Reset;
