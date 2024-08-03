import BlurBg from '@components/blur-bg/BlurBg';
import CoverImage from '@components/cover-image/CoverImage';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
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
import { TIME } from './config';
import { BLEConfig } from '@utils/ble';
import useBLE from '@hooks/useBLE';
import { useTranslation } from 'react-i18next';
import {
  FadeInView,
  SpringInViewXY,
} from '@components/fade-in-view/FadeInView';

type MusicScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MusicScreen'>,
  NativeStackScreenProps<RootStackParamList, 'Home'>
> &
  PropsWithChildren<{ name?: string }>;
const MusicScreen = (props: MusicScreenProps) => {
  const { navigation } = props;
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const { bleWrite } = useBLE();
  useEffect(() => {
    bleWrite(
      switchValue ? BLEConfig.musicScreen.open : BLEConfig.musicScreen.close,
    );
  }, [bleWrite, switchValue]);
  const { t } = useTranslation();
  return (
    <FadeInView>
      <ImageBackground
        style={{
          flex: 1,
          backgroundColor: 'rgba(19, 20, 22, 1)',
        }}
        source={require('../../assets/bg-home.png')}>
        <StatusBar />
        <ScrollView>
          <SpringInViewXY width={-300} height={-300}>
            <CoverImage
              type="music"
              handleNavigationPerson={() => navigation.push('Settings')}
              handleNavigationDevice={() => navigation.push('DeviceList')}
              marginTop={-50}
              bottom={32}
            />
          </SpringInViewXY>
          <SpringInViewXY width={300} height={300}>
            <View style={{ marginTop: 28, paddingHorizontal: 5 }}>
              <View
                style={{
                  backgroundColor: 'rgba(52, 53, 54, 0.3)',
                  padding: 22,
                  borderRadius: 30,
                }}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Text style={{ color: 'white', fontSize: 22 }}>
                      {t('schedute')}
                    </Text>
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
                  <PickTime type={TIME.AM} />
                  <PickTime type={TIME.PM} />
                </View>
              </View>
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
                onPress={() => navigation.push('LEDStripsEffects')}>
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
                    {t('LED-Strips-Effects')}
                  </Text>
                  <Image
                    source={require('../../assets/music/led.png')}
                    style={{ width: 140 / 2, height: 116 / 2 }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, marginLeft: 5 }}
                onPress={() => navigation.push('Scenes')}>
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
                    {t('scenes')}
                  </Text>
                  <Image
                    source={require('../../assets/music/scenes.png')}
                    style={{ width: 138 / 2, height: 138 / 2 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View />
          </SpringInViewXY>
        </ScrollView>
        {/* https://github.com/rcbyr/keen-slider */}
      </ImageBackground>
    </FadeInView>
  );
};
export default MusicScreen;
