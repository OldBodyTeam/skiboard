import CoverImage from '@components/cover-image/CoverImage';
import Progress from '@components/progress/Progress';
import Switch from '@components/switch/Switch';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  StatusBar,
  View,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList } from 'route.config';
import { TabParamList } from '@pages/home/tab-config';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';
import SelectedColor from '@components/selected-color/SelectedColor';
import useBLE from '@hooks/useBLE';
import { BLEConfig } from '@utils/ble';
import { lightScreen } from '@config/light-screen';
import { useTranslation } from 'react-i18next';
import { FadeInView, SpringInView } from '@components/fade-in-view/FadeInView';
import { getHex } from '@utils/hex';
import { useToastMessage } from '@hooks/useAxiosError';
import { useSend } from '@utils/send';
import { useDebounce, useDebounceFn, useMemoizedFn } from 'ahooks';
const data = ['#FFFF00', '#FF00AB', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'];
const randomNumber = () => Math.floor(Math.random() * 256);
type LightScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MusicScreen'>,
  NativeStackScreenProps<RootStackParamList, 'Home'>
> &
  PropsWithChildren<{ name?: string }>;
const LightScreen = (props: LightScreenProps) => {
  const { navigation } = props;
  const [progress, setProgress] = useState(0);
  const [colorPointer, setColorPointer] = useState('57ed04FF8A5E61');
  const [selected, setSelected] = useState(-1);
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const { toast } = useToastMessage();
  const { t } = useTranslation();
  const { queue, consumer } = useSend();
  const { run: handleSelectedColor } = useDebounceFn(
    (currentOptIndex: number) => {
      if (!switchValue) {
        toast(t('not-strip'));
        return;
      }
      queue.enqueue(`57af02${getHex(progress)}61`);
      if (switchValue && currentOptIndex !== 11) {
        setSelected(currentOptIndex);
        const writeData = data[currentOptIndex].slice(1);
        // console.log(
        //   writeData,
        //   BLEConfig.lightScreen[writeData as keyof typeof lightScreen],
        // );
        const color =
          BLEConfig.lightScreen[writeData as keyof typeof lightScreen];
        queue.enqueue(color);
        setColorPointer(color);
      } else if (currentOptIndex === 11) {
        const color = `57ed04${getHex(randomNumber())}${getHex(
          randomNumber(),
        )}${getHex(randomNumber())}61`;
        queue.enqueue(color);
        setColorPointer(color);
        setSelected(11);
      }
      consumer.startConsuming(bleWrite);
    },
    { wait: 50 },
  );
  const { bleWrite } = useBLE();

  const { run: handleProgressChange } = useDebounceFn(
    (num: number) => {
      bleWrite(`57af02${getHex(num)}61`);
      setProgress(num);
    },
    { wait: 50 },
  );
  // useEffect(() => {
  //   if (typeof progress === 'number') {
  //     bleWrite(`57af02${getHex(progress)}61`);
  //   }
  // }, [bleWrite, progress]);

  // useEffect(() => {
  //   bleWrite(
  //     switchValue
  //       ? BLEConfig.lightScreen.openLight
  //       : BLEConfig.lightScreen.closeLight,
  //   );
  // }, [bleWrite, switchValue]);

  const handleSelected = useMemoizedFn(async (color: string) => {
    await bleWrite(`57ed04${color}61`);
    setColorPointer(`57ed04${color}61`);
  });
  const { run: handleOpenLight } = useDebounceFn(
    async (value: boolean) => {
      queue.enqueue(
        value
          ? BLEConfig.lightScreen.openLight
          : BLEConfig.lightScreen.closeLight,
      );
      if (value) {
        queue.enqueue(colorPointer);
      }
      // queue.enqueue(colorPointer);
      // await bleWrite(
      //   value
      //     ? BLEConfig.lightScreen.openLight
      //     : BLEConfig.lightScreen.closeLight,
      // );
      // if (value) {
      //   await bleWrite('57ed04FF8A5E61');
      // }
      setSwitchValue(value);
      consumer.startConsuming(bleWrite);
    },
    { wait: 50 },
  );
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: '#131416',
      }}
      source={require('../../assets/bg-home.png')}>
      <StatusBar />

      <ScrollView>
        <FadeInView>
          <CoverImage
            type="light"
            marginTop={80}
            handleNavigationPerson={() => navigation.push('Settings')}
            handleNavigationDevice={() => navigation.push('DeviceList')}
            bottom={53}>
            <View style={{ marginTop: 137 / 2, marginLeft: 25 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#121115',
                }}>
                Snowboard Light
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#121115',
                  marginTop: 6,
                }}>
                Atmospheric Mode
              </Text>
            </View>
          </CoverImage>
        </FadeInView>
        <SpringInView duration={900}>
          <View
            style={{
              marginHorizontal: 5,
              backgroundColor: 'rgba(52, 53, 54, 0.3)',
              borderRadius: 30,
              padding: 16,
              position: 'relative',
            }}>
            <SelectedColor handleSelected={handleSelected} />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <Progress onProgressChange={handleProgressChange} />
              <Switch
                switchValue={switchValue}
                onSwitchChange={handleOpenLight}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                flex: 1,
              }}>
              {data.map((color, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectedColor(index)}
                    key={color + index}>
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        borderColor: 'white',
                        borderRadius: 55,
                        backgroundColor: 'transparent',
                        borderWidth: selected === index ? 2 : 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: color,
                          borderRadius: 40,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity onPress={() => handleSelectedColor(11)}>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderColor: 'white',
                    borderRadius: 55,
                    backgroundColor: 'transparent',
                    borderWidth: selected === 11 ? 2 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../../assets/light/all.png')}
                    style={{ width: 36, height: 36 }}
                  />
                </View>
              </TouchableOpacity>
            </ScrollView>
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
              onPress={() => navigation.push('LightGlowModes')}>
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
                    marginVertical: 52 / 2,
                  }}>
                  {t('lightGlow-modes')}
                </Text>
                <Image
                  source={require('../../assets/light/flush.png')}
                  style={{
                    width: 101 / 2,
                    height: 132 / 2,
                    marginBottom: 52 / 2,
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, marginLeft: 5 }}
              onPress={() => navigation.push('SoundEffects')}>
              <View
                style={{
                  height: 322 / 2,
                  width: '100%',
                  backgroundColor: 'rgba(52, 53, 54, 0.3)',
                  borderRadius: 30,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#ffffff',
                    marginVertical: 52 / 2,
                  }}>
                  {t('sound-effects')}
                </Text>
                <Image
                  source={require('../../assets/light/music.png')}
                  style={{ width: 124 / 2, height: 124 / 2 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </SpringInView>
      </ScrollView>
    </ImageBackground>
  );
};
export default LightScreen;
