import CoverImage from '@components/cover-image/CoverImage';
import CustomThumb from '@components/custom-thumb/CustomThumb';
import Progress from '@components/progress/Progress';
import Switch from '@components/switch/Switch';
import React, { PropsWithChildren, useState } from 'react';
import {
  StatusBar,
  View,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import ColorPicker, { HueSlider } from 'reanimated-color-picker';
import type { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList } from 'route.config';
import { TabParamList } from '@pages/home/tab-config';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';
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
    if (switchValue) {
      setSelected(currentOptIndex);
    }
  };
  const [progress, setProgress] = useState(0);
  const handleProgressChange = (num: number) => {
    setProgress(num);
  };
  console.log(progress);
  const onSelectColor = ({ hex }: { hex: string }) => {
    // do something with the selected color.
    console.log(hex);
    setSelected(-1);
  };
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
          handleNavigationPerson={() => navigation.navigate('Settings')}
          handleNavigationDevice={() => navigation.navigate('DeviceList')}
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
          <View style={{ flex: 1 }}>
            <ColorPicker value="red" onComplete={onSelectColor}>
              <HueSlider
                style={{
                  borderRadius: 60,
                  marginBottom: 10,
                }}
                boundedThumb
                sliderThickness={60}
                thumbColor="#FFFFFF"
                renderThumb={CustomThumb}
              />
            </ColorPicker>
          </View>
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
            {[
              '#FFFFFF',
              '#FACF00',
              '#00FEFC',
              '#FF8A5E',
              '#FF8A5E',
              '#60AEE6',
            ].map((color, index) => {
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
            onPress={() => navigation.navigate('LightGlowModes')}>
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
                LightGlow Modes
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
            onPress={() => navigation.navigate('SoundEffects')}>
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
                Sound Effects
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
