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
import { Buffer } from 'buffer';
import useBLE from '@hooks/useBLE';
import { BLEConfig } from '@utils/ble';
import { lightScreen } from '@config/light-screen';
import { useTranslation } from 'react-i18next';
const data = ['#FFFFFF', '#FACF00', '#00FEFC', '#FF8A5E', '#AA8F1E', '#60AEE6'];
type LightScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MusicScreen'>,
  NativeStackScreenProps<RootStackParamList, 'Home'>
> &
  PropsWithChildren<{ name?: string }>;
const LightScreen = (props: LightScreenProps) => {
  const { navigation } = props;

  const [selected, setSelected] = useState(-1);
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const handleSelectedColor = (currentOptIndex: number) => {
    if (switchValue && currentOptIndex !== 11) {
      setSelected(currentOptIndex);
      const writeData = data[currentOptIndex].slice(1);
      bleWrite(BLEConfig.lightScreen[writeData as keyof typeof lightScreen]);
    } else if (currentOptIndex === 11) {
      bleWrite(BLEConfig.lightScreen.random);
      setSelected(11);
    }
  };
  const [progress, setProgress] = useState(0);
  const handleProgressChange = (num: number) => {
    setProgress(num);
  };
  const { bleWrite } = useBLE();
  useEffect(() => {
    if (typeof progress === 'number') {
      bleWrite(`57ee02${progress}61`);
    }
  }, [bleWrite, progress]);

  useEffect(() => {
    bleWrite(
      switchValue
        ? BLEConfig.lightScreen.openLight
        : BLEConfig.lightScreen.closeLight,
    );
  }, [bleWrite, switchValue]);

  const handleSelected = (color: string) => {
    console.log(color);
    bleWrite(BLEConfig.lightScreen[color as keyof typeof lightScreen]);
  };
  const { t } = useTranslation();
  console.log(selected);
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: '#131416',
      }}
      source={require('../../assets/bg-home.png')}>
      <StatusBar />
      <ScrollView>
        <CoverImage
          type="light"
          marginTop={80}
          handleNavigationPerson={() => navigation.push('Settings')}
          handleNavigationDevice={() => navigation.push('DeviceList')}
          bottom={53}>
          <View style={{ marginTop: 137 / 2, marginLeft: 25 }}>
            <Text
              style={{ fontSize: 24, fontWeight: 'bold', color: '#121115' }}>
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
              onSwitchChange={(value: boolean) => setSwitchValue(value)}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              // display: 'flex',
              // alignItems: 'center',
              // justifyContent: 'space-between',
              // flexDirection: 'row',
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
      </ScrollView>
    </ImageBackground>
  );
};
export default LightScreen;
