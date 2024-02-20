import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';
import Header from '@components/header/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientRequest } from '@services/client';
import { UserAvatarDto } from '@services/data-contracts';
import { userInfoState } from '@stores/login/login.atom';
import { window } from 'd3';
import React, { PropsWithChildren, useRef, useState } from 'react';
import {
  Image,
  Platform,
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
import { useRecoilState } from 'recoil';
import RNFetchBlob from 'rn-fetch-blob';
import { RootStackParamList } from 'route.config';
const pageInfo = [
  { label: 'HOME' },
  { label: 'GUIDE' },
  { label: 'ABOUT' },
  { label: 'BLOG' },
];
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
        // const response = await fetch(ImageUri);
        // const fileBlob = await RNFetchBlob.fs.readFile(ImageUri, 'base64');
        // const blob = await response.blob(assets[0].type!, -1);
        // const a = await response.blob();

        // const file = new File([a], assets[0].fileName, {
        //   type: assets[0].type!,
        //   lastModified: Date.now(),
        // });
        // const data = new FormData();
        // data.append('file', {
        //   uri: ImageUri,
        //   type: assets[0].type,
        //   name: assets[0].fileName,
        // });
        // console.log(data);
        const data = new FormData();
        data.append('file', {
          name: assets[0].fileName,
          uri:
            Platform.OS === 'android'
              ? ImageUri
              : ImageUri.replace('file://', ''),
        });
        console.log(data);
        const client = await ClientRequest();
        const requestData = await client.userControllerModifyAvatar(
          userInfo!.id,
          data as any,
        );
        console.log(requestData);
        setUserInfo(requestData.data.data);
        // var reader = new FileReader();
        // reader.onload = async () => {
        //   // const client = await ClientRequest();
        //   const data = new FormData();
        //   data.append('file', reader.result);

        //   console.log(reader.result);
        // };
        // reader.readAsDataURL(blob);
        // const data = new FormData();
        // data.append('file', blob);

        // console.log(requestData);
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
                  onPress={() => navigation.navigate('Home')}>
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
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
                    color: '#F9DD58',
                    lineHeight: 53,
                    fontFamily: 'FuturaLT-ExtraBold',
                  }}>
                  STORY
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
      <BlurModal ref={modalEditRef} title="Rename" content="Change  Username">
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
            onPress={() => modalEditRef.current?.closeModal()}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{ color: '#FCE500', fontWeight: 'bold', fontSize: 16 }}>
                Confirm
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </BlurModal>
    </View>
  );
};
export default Settings;
