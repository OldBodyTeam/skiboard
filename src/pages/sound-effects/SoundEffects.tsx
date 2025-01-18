/* eslint-disable react-hooks/exhaustive-deps */
import AudioRecorderPlayerWithWave from '@components/audio-recorder-player/AudioRecorderPlayer';

import Header from '@components/header/Header';
import MusicCarousel from '@components/music-carousel/MusicCarousel';
import MusicPlayer from '@components/music-player/MusicPlayer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  ImageBackground,
} from 'react-native';
import { RootStackParamList } from 'route.config';
import { musicListData } from './utils';
import SoundEffectsCarousel from '@components/sound-effects-carousel/SoundEffectsCarousel';
import ModeButton from './components/mode-button/ModeButton';
import ClickSensitivityProgress from '@components/sensitivity-progress/ClickSensitivityProgress';
import useBLE from '@hooks/useBLE';
import { BLEConfig } from '@utils/ble';
import { useTranslation } from 'react-i18next';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import TrackPlayer, { State, Event } from 'react-native-track-player';
import { get } from 'lodash';
import { wave } from '@components/music-player/assets/wave';
import { useSend } from '@utils/send';
enum TABS {
  MUSIC = 'music',
  SOUND = 'sound',
}
export enum MODULENAME {
  FlowingWater = 'Flowing Water',
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
    setCurrentSelectedLine(id);
  };
  const [currentSelected, setCurrentSelected] = useState(TABS.SOUND);
  const handleSelected = (status: TABS) => {
    setCurrentSelected(status);
  };
  const { bleWrite } = useBLE();
  const [selectModuleName, setSelectModuleName] = useState<MODULENAME>();
  const handleMode = (moduleName: MODULENAME) => {
    setSelectModuleName(moduleName);
    bleWrite(BLEConfig.sensitivity[moduleName]);
  };
  const { t } = useTranslation();
  const [sIndex, setSIndex] = useState(1);
  const handleS = useMemoizedFn((index: number) => {
    setSIndex(index);
  });
  const { queue, consumer } = useSend();
  const runx = useMemoizedFn(async (volume: string, i: number) => {
    console.log('*********', i);
    queue.enqueue(`57e204${volume}61`);
  });
  const countRef = useRef(0);
  const recorderRef = useRef<Set<string>>(new Set());
  const [title, setTitle] = useState('Ocean-of-Thought');
  useUnmount(() => {
    countRef.current = 0;
    recorderRef.current = new Set();
    queue.clear();
    TrackPlayer.stop();
  });
  const r = (data: number[]) => {
    const minVal = Math.min(...data);
    console.log('minVal', minVal);
    const maxVal = Math.max(...data);
    console.log('maxVal', maxVal);
    const normalizedData = data.map(
      value => ((value - minVal) / (maxVal - minVal)) * 255,
    );
    const hexDataWithSign = normalizedData.map(value => {
      const intValue = Math.round(value); // 转为整数
      const hexValue = intValue.toString(16).toUpperCase().padStart(2, '0'); // 转为两位十六进制
      return hexValue;
    });
    return hexDataWithSign;
  };
  const a = (data: number[]) => {
    const k = data.map(v => {
      const h = v + 1;
      return Math.round(h * 100000000);
    });
    // console.log(k);
    const normalizedData = k.reduce(
      (init, value) => {
        const m =
          String(value).length < 9 ? '0' + String(value) : String(value);
        init.a.push(Number(m.slice(0, 3)));
        init.b.push(Number(m.slice(3, 6)));
        init.c.push(Number(m.slice(6, 9)));
        return init;
      },
      {
        a: [],
        b: [],
        c: [],
      },
    );
    const t1 = r(normalizedData.a);
    const t2 = r(normalizedData.b);
    const t3 = r(normalizedData.c);
    // 步骤 2: 保留符号并转换为十六进制
    // const hexDataWithSign = normalizedData.map(value => {
    //   const intValue = Math.round(value); // 转为整数
    //   const hexValue = intValue.toString(16).toUpperCase().padStart(2, '0'); // 转为两位十六进制
    //   return hexValue;
    // });
    // console.log(t1);

    // // 步骤 3: 每三组组合成指令
    const instructions = [];
    for (let i = 0; i < t1.length; i++) {
      instructions.push(t1[i] + t2[i] + t3[i]);
    }
    return instructions;
  };
  const poi = useRef<number>(0);
  useEffect(() => {
    if (currentSelected === TABS.MUSIC) {
      queue.clear();
      const num = a(get(wave, `${title}`, []).filter(v => v));
      const element = num.map(v => `57e204${v}61`);
      poi.current = element.length;
      queue.enqueue(element);
    }
  }, [title]);
  useUnmount(() => {
    queue.clear();
  });

  useMount(() => {
    TrackPlayer.addEventListener(Event.PlaybackState, event => {
      // console.log('***********************', event.state);
      // if (event.state === State.Loading) {
      //   TrackPlayer.stop();
      // }
      if (State.Ended === event.state) {
        queue.clear();
        const num = a(get(wave, `${title}`, []).filter(v => v));
        const element = num.map(v => `57e204${v}61`);
        poi.current = element.length;
        queue.enqueue(element);
      } else {
        if (event.state !== State.Playing) {
          consumer.pauseConsuming();
        } else {
          // consumer.startMusicConsuming(bleWrite, 400, poi.current);
        }
      }
    });

    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async event => {
      const position = Math.floor(
        (event.position / event.duration) * (poi.current || 1),
      );

      consumer.startMusicConsuming(bleWrite, 400, position);
    });
    TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async event => {
        const title1 = get(event, 'track.title', '').slice(0, -4);
        queue.clear();
        const num = a(get(wave, `${title1}`, []).filter(v => v));
        const element = num.map(v => `57e204${v}61`);
        poi.current = element.length;
        queue.enqueue(element);
        // consumer.startMusicConsuming(bleWrite, 400, poi.current);
      },
    );
  });
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flexDirection: 'row',
      }}
      source={require('../../assets/sound-effects/bg.png')}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View>
            <Header title={t('lightGlow-modes')} handlePress={back} />
            <View style={{ marginTop: 2 }}>
              <SoundEffectsCarousel
                autoPlay
                carouselData={[
                  { title: require('../../assets/sound-effects/music.png') },
                ]}
                style={{ width: 496, height: 66 }}
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
                style={{ width: 409.5, height: 34 }}
                handleSelected={() => handleSelected(TABS.SOUND)}
                currentSelected={currentSelected === TABS.SOUND}
              />
            </View>
          </View>

          {currentSelected === TABS.MUSIC ? (
            <>
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
                  {t('Calibrating-your-music-taste')}
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
                      setTitle={setTitle}
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
                  {t('love')}
                </Text>
              </View>
              <MusicPlayer />
            </>
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
                {t('Microphone')}
              </Text>
              <AudioRecorderPlayerWithWave sIndex={sIndex} />
              {/* <Waveform /> */}
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 12,
                  lineHeight: 15,
                  color: '#010203',
                  marginLeft: 20,
                  marginTop: 20,
                }}>
                {t('Sensitivity')}
              </Text>
              {/* <SensitivityProgress /> */}
              <ClickSensitivityProgress onChange={handleS} />
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
    </ImageBackground>
  );
};
export default SoundEffects;
