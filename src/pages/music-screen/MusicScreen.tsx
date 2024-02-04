import BlurBg from '@components/blur-bg/BlurBg';
import CoverImage from '@components/cover-image/CoverImage';
import React, { PropsWithChildren, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Switch from '@components/switch/Switch';
import { TabParamList } from '@pages/home/tab-config';
import { RootStackParamList } from 'route.config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import PickTime from '@components/pick-time/PickTime';
type MusicScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MusicScreen'>,
  NativeStackScreenProps<RootStackParamList, 'Home'>
> &
  PropsWithChildren<{ name?: string }>;
const MusicScreen = (props: MusicScreenProps) => {
  const { navigation } = props;
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
      }}>
      <StatusBar />
      <ScrollView>
        <CoverImage
          type="music"
          handleNavigationPerson={() => navigation.navigate('Settings')}
          handleNavigationDevice={() => navigation.navigate('DeviceList')}
          marginTop={-50}
        />
        <View style={{ marginTop: 28, paddingHorizontal: 5 }}>
          <BlurBg borderRadius={30} width={'100%'}>
            <View style={{ backgroundColor: 'transparent', padding: 22 }}>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View>
                  <Text style={{ color: 'white', fontSize: 22 }}>Schedute</Text>
                </View>
                <Switch
                  switchValue={switchValue}
                  onSwitchChange={setSwitchValue}
                />
              </View>
              <View
                style={{
                  marginTop: 22,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <PickTime type="AM" />
                <PickTime type="PM" />
              </View>
            </View>
          </BlurBg>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 5,
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('LEDStripsEffects')}>
            <View
              style={{
                height: 322 / 2,
                width: '100%',
                backgroundColor: 'rgba(52, 53, 54, 0.3)',
                borderRadius: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#ffffff',
                  marginBottom: 66 / 2,
                }}>
                LED Strips Effects
              </Text>
              <Image
                source={require('../../assets/music/led.png')}
                style={{ width: 140 / 2, height: 116 / 2 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, marginLeft: 5 }}
            onPress={() => navigation.navigate('Scenes')}>
            <View
              style={{
                height: 322 / 2,
                width: '100%',
                backgroundColor: 'rgba(52, 53, 54, 0.3)',
                borderRadius: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#ffffff',
                  marginBottom: 45 / 2,
                }}>
                Scenes
              </Text>
              <Image
                source={require('../../assets/music/scenes.png')}
                style={{ width: 138 / 2, height: 138 / 2 }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View />
      </ScrollView>
      {/* https://github.com/rcbyr/keen-slider */}
    </View>
  );
};
export default MusicScreen;
