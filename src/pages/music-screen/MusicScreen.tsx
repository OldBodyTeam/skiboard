/* eslint-disable react-hooks/exhaustive-deps */
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
import { FadeInView, SpringInView } from '@components/fade-in-view/FadeInView';
import { useMemoizedFn } from 'ahooks';
import { getHex } from '@utils/hex';
import { handleSendOpenApp } from '@pages/ble-manager/BleManager';
import { useSend } from '@utils/send';

type MusicScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MusicScreen'>,
  NativeStackScreenProps<RootStackParamList, 'Home'>
> &
  PropsWithChildren<{ name?: string }>;
const MusicScreen = (props: MusicScreenProps) => {
  const { navigation } = props;
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const { bleWrite } = useBLE();
  // useEffect(() => {
  //   bleWrite(
  //     switchValue ? BLEConfig.musicScreen.open : BLEConfig.musicScreen.close,
  //   );
  // }, [bleWrite, switchValue]);
  const { t } = useTranslation();
  const [pointer, setPointer] = useState<
    Map<number, { type: TIME; currentTime: [number, number] }>
  >(new Map());
  const { queue, consumer } = useSend();
  const handleCode = useMemoizedFn(
    (data: { type: TIME; currentTime: [number, number] }) => {
      const { type, currentTime } = data;
      if (type === TIME.AM) {
        return `${getHex(currentTime[0] - 1)}${getHex(currentTime[1] - 1)}`;
      }
      if (type === TIME.PM) {
        return `${getHex(currentTime[0] + 11)}${getHex(currentTime[1] - 1)}`;
      }
    },
  );
  const onHandleTime = useMemoizedFn(
    (numType: number, data: { type: TIME; currentTime: [number, number] }) => {
      const code = handleSendOpenApp();
      queue.enqueue(code);
      const c = handleCode(data);
      if (numType === 1) {
        queue.enqueue(`57ae05${c}00ff61`);
      } else if (numType === 2) {
        queue.enqueue(`57ae05${c}01ff61`);
      }
      consumer.startConsuming(bleWrite);
      setPointer(prev => {
        prev.set(numType, data);
        return new Map(prev);
      });
    },
  );
  // const send = useMemoizedFn(
  //   async (time: { type: TIME; currentTime: [number, number] }) => {
  //     const { type, currentTime } = time;
  //     //休息休息
  //     if (type === TIME.AM) {
  //       await bleWrite(
  //         `57ae05${getHex(currentTime[0] - 1)}${getHex(
  //           currentTime[1] - 1,
  //         )}00ff61`,
  //       );
  //       await sleep();
  //     }
  //     if (type === TIME.PM) {
  //       await bleWrite(
  //         `57ae05${getHex(currentTime[0] + 11)}${getHex(
  //           currentTime[1] - 1,
  //         )}01ff61`,
  //       );
  //       await sleep();
  //     }
  //   },
  // );
  useEffect(() => {
    const run = async () => {
      const firstTime = pointer.get(1);
      const secondTime = pointer.get(2);
      if (pointer.size === 2 && firstTime && secondTime) {
        const code = handleSendOpenApp();
        queue.enqueue(code);
        const c1 = handleCode(firstTime);
        const c2 = handleCode(secondTime);
        queue.enqueue(`57ae05${c1}00ff61`);
        queue.enqueue(`57ae05${c2}01ff61`);
        consumer.startConsuming(bleWrite);
      }
    };
    run();
  }, [pointer]);
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
      }}
      source={require('../../assets/bg-home.png')}>
      <StatusBar />
      <ScrollView>
        <FadeInView>
          <CoverImage
            type="music"
            handleNavigationPerson={() => navigation.push('Settings')}
            handleNavigationDevice={() => navigation.push('DeviceList')}
            marginTop={-50}
            bottom={32}
          />
        </FadeInView>
        <SpringInView duration={900}>
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
                  onSwitchChange={value => {
                    bleWrite(
                      value
                        ? BLEConfig.musicScreen.open
                        : BLEConfig.musicScreen.close,
                    );
                    setSwitchValue(value);
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 22,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <PickTime
                  type={TIME.AM}
                  numType={1}
                  onHandleTime={onHandleTime}
                  switchValue={switchValue}
                />
                <PickTime
                  type={TIME.PM}
                  numType={2}
                  onHandleTime={onHandleTime}
                  switchValue={switchValue}
                />
              </View>
            </View>
          </View>
        </SpringInView>
        <SpringInView duration={1500}>
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
        </SpringInView>
      </ScrollView>
      {/* https://github.com/rcbyr/keen-slider */}
    </ImageBackground>
  );
};
export default MusicScreen;
