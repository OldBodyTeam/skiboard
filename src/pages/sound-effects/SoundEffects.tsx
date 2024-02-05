import AudioRecorderPlayerWithWave from '@components/audio-recorder-player/AudioRecorderPlayer';

import Header from '@components/header/Header';
import MusicCarousel from '@components/music-carousel/MusicCarousel';
import MusicPlayer from '@components/music-player/MusicPlayer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { PropsWithChildren, useState } from 'react';
import { View, StatusBar, SafeAreaView, ScrollView, Text } from 'react-native';
import { RootStackParamList } from 'route.config';
import { musicListData } from './utils';
import SoundEffectsCarousel from '@components/sound-effects-carousel/SoundEffectsCarousel';
import { useScreenSize } from '@hooks/useScreenSize';
import SensitivityProgress from '@components/sensitivity-progress/SensitivityProgress';
import ModeButton from './components/mode-button/ModeButton';
enum TABS {
  MUSIC = 'music',
  SOUND = 'sound',
}
export enum MODULENAME {
  FlowingWater = 'Flowing water',
  Meteor = 'Meteor',
  Fluctuate = 'Fluctuate',
  Energy = 'Energy',
  StarryStars = 'Starry Stars',
  WaterDroplets = 'Water droplets',
  Fireflies = 'Fireflies',
  Fireworks = 'Fireworks',
}

type SoundEffectsProps = NativeStackScreenProps<
  RootStackParamList,
  'SoundEffects'
> &
  PropsWithChildren<{ name?: string }>;
const SoundEffects = (props: SoundEffectsProps) => {
  const { navigation } = props;

  const back = () => {
    navigation.goBack();
  };
  const [selectedInterpolate, setSelectedInterpolate] = useState<{
    [p: number]: number;
  }>({
    1: -1,
    2: -1,
    3: -1,
    4: -1,
    5: -1,
    6: -1,
  });
  const [currentSelectedLine, setCurrentSelectedLine] = useState(-1);
  const handleAutoPlay = (id: number, title: string, index?: number) => {
    setSelectedInterpolate(() => {
      return {
        1: -1,
        2: -1,
        3: -1,
        4: -1,
        5: -1,
        6: -1,
        [id]: index!,
      };
    });
    console.log('xxxx', id, index);
    setCurrentSelectedLine(id);
  };
  const { width } = useScreenSize();
  const [currentSelected, setCurrentSelected] = useState(TABS.MUSIC);
  const handleSelected = (status: TABS) => {
    setCurrentSelected(status);
  };
  const [selectModuleName, setSelectModuleName] = useState<MODULENAME>();
  const handleMode = (moduleName: MODULENAME) => {
    console.log(moduleName);
    setSelectModuleName(moduleName);
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flexDirection: 'row',
      }}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
          }}>
          <View>
            <Header title="LightGlow Modes" handlePress={back} />
            <View style={{ marginTop: 2 }}>
              <SoundEffectsCarousel
                autoPlay
                carouselData={[
                  { title: require('../../assets/sound-effects/music.png') },
                ]}
                style={{ width: width - 10, height: 66 }}
                handleSelected={() => handleSelected(TABS.MUSIC)}
                currentSelected={currentSelected === TABS.MUSIC}
              />
            </View>
            <View style={{ marginTop: 32 }}>
              <SoundEffectsCarousel
                autoPlayReverse
                autoPlay
                carouselData={[
                  { title: require('../../assets/sound-effects/sound.png') },
                ]}
                style={{ width, height: 34 }}
                handleSelected={() => handleSelected(TABS.SOUND)}
                currentSelected={currentSelected === TABS.SOUND}
              />
            </View>
          </View>

          {currentSelected === TABS.MUSIC ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  marginVertical: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    lineHeight: 29 / 2,
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  Calibrating your music taste
                </Text>
              </View>
              {musicListData.map(item => {
                return (
                  <View key={item.index} style={{ marginVertical: 12 }}>
                    <MusicCarousel
                      carouselData={item.data}
                      autoPlay
                      handleAutoPlay={(title, index) =>
                        handleAutoPlay(item.index, title, index)
                      }
                      autoPlayReverse={item.index % 2 !== 1}
                      selectedIndex={selectedInterpolate[item.index]}
                      currentSelectedLine={item.index === currentSelectedLine}
                    />
                  </View>
                );
              })}

              <View
                style={{
                  flex: 1,
                  marginTop: 25,
                  marginBottom: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    lineHeight: 36 / 2,
                    fontSize: 15,
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica',
                    color: 'white',
                  }}>
                  Select artiste you love
                </Text>
              </View>
              {/* <AudioRecorderPlayerWithWave /> */}
              <MusicPlayer />
            </View>
          ) : null}
          {currentSelected === TABS.SOUND ? (
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 12,
                marginHorizontal: 6,
                marginBottom: 16,
                overflow: 'hidden',
                marginTop: 32,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginLeft: 20,
                  marginTop: 20,
                }}>
                Microphone
              </Text>
              <AudioRecorderPlayerWithWave />
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 12,
                  lineHeight: 15,
                  color: '#010203',
                  marginLeft: 20,
                  marginTop: 20,
                }}>
                Sensitivity
              </Text>
              <SensitivityProgress />
              <View
                style={{
                  position: 'relative',
                  height: 300,
                  marginTop: 32,
                }}>
                <ModeButton
                  style={{
                    position: 'absolute',
                    left: 58 / 2,
                    top: 20,
                    transform: [{ rotateZ: '-10deg' }],
                  }}
                  moduleName={MODULENAME.FlowingWater}
                  handleMode={handleMode}
                  selectModuleName={selectModuleName}
                />
                <ModeButton
                  style={{
                    position: 'absolute',
                    right: 58 / 2,
                    top: 20,
                    transform: [{ rotateZ: '18deg' }],
                  }}
                  moduleName={MODULENAME.Meteor}
                  handleMode={handleMode}
                  selectModuleName={selectModuleName}
                />
                <ModeButton
                  style={{
                    position: 'absolute',
                    left: 232 / 2,
                    top: 134 / 2,
                    transform: [{ rotateZ: '-2deg' }],
                  }}
                  moduleName={MODULENAME.Fluctuate}
                  handleMode={handleMode}
                  selectModuleName={selectModuleName}
                />
                <ModeButton
                  style={{
                    position: 'absolute',
                    left: 68 / 2,
                    top: 244 / 2,
                    transform: [{ rotateZ: '20deg' }],
                  }}
                  moduleName={MODULENAME.Energy}
                  handleMode={handleMode}
                  selectModuleName={selectModuleName}
                />
                <ModeButton
                  style={{
                    position: 'absolute',
                    right: 108 / 2,
                    top: 244 / 2,
                    transform: [{ rotateZ: '-14deg' }],
                  }}
                  moduleName={MODULENAME.StarryStars}
                  handleMode={handleMode}
                  selectModuleName={selectModuleName}
                />
                <ModeButton
                  style={{
                    position: 'absolute',
                    right: -40 / 2,
                    top: 394 / 2,
                    transform: [{ rotateZ: '-70deg' }],
                  }}
                  moduleName={MODULENAME.WaterDroplets}
                  handleMode={handleMode}
                  selectModuleName={selectModuleName}
                />
                <ModeButton
                  style={{
                    position: 'absolute',
                    right: 200 / 2,
                    top: 394 / 2,
                    transform: [{ rotateZ: '-6deg' }],
                  }}
                  moduleName={MODULENAME.Fireflies}
                  handleMode={handleMode}
                  selectModuleName={selectModuleName}
                />
                <ModeButton
                  style={{
                    position: 'absolute',
                    left: 40 / 2,
                    top: 464 / 2,
                    transform: [{ rotateZ: '16deg' }],
                  }}
                  moduleName={MODULENAME.Fireworks}
                  handleMode={handleMode}
                  selectModuleName={selectModuleName}
                />
              </View>
            </View>
          ) : null}
          {/* </View> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default SoundEffects;
