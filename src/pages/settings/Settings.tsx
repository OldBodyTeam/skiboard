import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';
import Header from '@components/header/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import { userInfoState } from '@stores/login/login.atom';
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-root-toast';
import { useRecoilState } from 'recoil';
import { RootStackParamList } from 'route.config';

type SettingsTextProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
> &
  PropsWithChildren<{ name?: string }>;
const Settings = (props: SettingsTextProps) => {
  const { navigation } = props;
  const [uri, setUri] = useState<Asset['uri']>();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const handleAvatar = async () => {
    try {
      const { didCancel, assets } = await launchImageLibrary({
        selectionLimit: 1,
        mediaType: 'photo',
      });
      if (!didCancel && assets && assets[0].uri) {
        const ImageUri = assets[0].uri;
        setUri(ImageUri);
        const data = new FormData();
        data.append('file', {
          name: assets[0].fileName,
          uri: ImageUri,
          type: assets[0].type,
        });
        console.log(data, ImageUri);
        const client = await ClientRequest();
        const requestData = await client.userControllerModifyAvatar(
          userInfo!.id,
          data as any,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            transformRequest: () => {
              return data;
            },
          },
        );
        const newUserInfo = requestData.data.data;
        setUserInfo(newUserInfo);
      }
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  };
  const back = () => {
    navigation.goBack();
  };
  const modalEditRef = useRef<BlurModalRef>(null);
  const [username, setUsername] = useState('Hyuk Design');
  useEffect(() => {
    setUsername(userInfo?.username ?? '');
    setUri(userInfo?.avatar);
  }, [userInfo]);
  const handleModifyUsername = async () => {
    try {
      modalEditRef.current?.closeModal();
      const client = await ClientRequest();
      if (!userInfo?.id) {
        return;
      }
      const result = await client.userControllerModifyUsername(userInfo.id, {
        username,
      });
      const newUserInfo = result.data.data;
      setUserInfo(newUserInfo);
    } catch (e) {
      Toast.show('修改用户名失败', {
        position: Toast.positions.CENTER,
        delay: 0,
        animation: true,
        duration: Toast.durations.SHORT,
      });
    }
  };
  const { t } = useTranslation();
  const pageInfo = useMemo(
    () => [
      { label: t('HOME') },
      { label: t('GUIDE') },
      { label: t('ABOUT') },
      { label: t('BLOG') },
    ],
    [t],
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flexDirection: 'row',
      }}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="" handlePress={back} />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              height: 100,
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={handleAvatar}
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                overflow: 'hidden',
              }}>
              <Image
                source={uri ? { uri } : require('../../assets/avatar.png')}
                resizeMode="cover"
                resizeMethod="scale"
                style={{ width: 100, height: 100 }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => modalEditRef.current?.openModal()}>
            <View
              style={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: '600',
                  color: 'white',
                }}>
                {username}
              </Text>
              <Image
                source={require('../../assets/settings/modyfy.png')}
                style={{ width: 37 / 2, height: 22, marginLeft: 8 }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ position: 'relative', marginTop: 97 / 2 }}>
            {pageInfo.map(v => {
              return (
                <TouchableOpacity
                  key={v.label}
                  onPress={() => navigation.push('Home')}>
                  <View
                    style={{
                      borderColor: 'rgba(216, 216, 216, 0.2)',
                      borderTopWidth: 3,
                      // borderBottomWidth: index === pageInfo.length - 1 ? 3 : 0,
                      paddingVertical: 12,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 44,
                        fontWeight: '600',
                        color: 'white',
                        lineHeight: 53,
                      }}>
                      {v.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={() => navigation.push('Home')}>
              <View
                style={{
                  borderColor: 'rgba(216, 216, 216, 0.2)',
                  borderTopWidth: 3,
                  borderBottomWidth: 3,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 44,
                    fontWeight: '600',
                    color: 'rgba(249, 221, 88, 1)',
                    lineHeight: 53,
                    fontFamily: 'FuturaLT-ExtraBold',
                  }}>
                  {t('STORY')}
                </Text>
              </View>
            </TouchableOpacity>
            <Image
              source={require('../../assets/settings/new.png')}
              style={{
                width: 198 / 2,
                height: 152 / 2,
                position: 'absolute',
                top: 63 / 2,
                right: 38,
              }}
            />
          </View>
          <View
            style={{
              marginBottom: 22,
              marginTop: 72,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/settings/logo.png')}
              style={{ width: 123 / 2, height: 55 / 2 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <BlurModal
        ref={modalEditRef}
        title={t('Rename')}
        content={t('Change-Username')}>
        <View style={{ display: 'flex', marginTop: 8, width: '100%' }}>
          <View style={{ paddingLeft: 21, paddingRight: 21, width: '100%' }}>
            <TextInput
              placeholder="Enter Username"
              style={{
                height: 36,
                backgroundColor: '#262626',
                borderRadius: 8,
                width: '100%',
                paddingLeft: 12,
                paddingRight: 12,
                color: 'white',
              }}
              value={username}
              onChange={e => setUsername(e.nativeEvent.text)}
            />
          </View>
          <TouchableHighlight
            style={{ flex: 1, marginTop: 12 }}
            onPress={handleModifyUsername}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{ color: '#FCE500', fontWeight: 'bold', fontSize: 16 }}>
                {t('confirm')}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </BlurModal>
    </View>
  );
};
export default Settings;
