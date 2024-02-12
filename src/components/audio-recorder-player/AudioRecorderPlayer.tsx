import React, { useEffect, useRef, useState } from 'react';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import type {
  AudioSet,
  // PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {
  // Dimensions,
  PermissionsAndroid,
  Platform,
  ScrollView,
  // SafeAreaView,
  // ScrollView,
  // StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useSharedValue,
  // useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
// import { Svg, Path, Rect } from 'react-native-svg';
// import { useScreenSize } from '@hooks/useScreenSize';
import Wave from './Wave';
import { coverVoiceToHeight } from './utils';
const initVoicePosition = [{ x: 0, y: coverVoiceToHeight(0, 0, 100, 7.5, 6) }];
// const AnimatedPath = Animated.createAnimatedComponent(Path);
// const AnimatedRect = Animated.createAnimatedComponent(Rect);
const path = Platform.select({ ios: undefined, android: undefined });

const AudioRecorderPlayerWithWave = () => {
  const audioRecorderPlayer = useRef<AudioRecorderPlayer>(
    new AudioRecorderPlayer(),
  );
  const [audioState, setAudioState] = useState({
    recordMetering: 0,
    currentPositionSec: 0,
    currentDurationSec: 0,
  });
  const [currentWidth, setCurrentWidth] = useState(60);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([
    ...initVoicePosition,
  ]);
  useEffect(() => {
    if (!audioRecorderPlayer.current) {
      audioRecorderPlayer.current = new AudioRecorderPlayer();
    }
    audioRecorderPlayer.current.setSubscriptionDuration(1);
  }, []);
  const onStartRecord = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('permissions granted');
        } else {
          console.log('All required permissions not granted');

          return;
        }
      } catch (err) {
        console.warn(err);

        return;
      }
    }
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    console.log('audioSet', audioSet);

    await audioRecorderPlayer.current.startRecorder(path, audioSet, true);

    audioRecorderPlayer.current.addRecordBackListener((e: RecordBackType) => {
      const xAxis = Math.floor(e.currentPosition / 1000);
      setAudioState(prev => {
        return {
          ...prev,
          recordMetering: e.currentMetering ?? 0,
          currentPositionSec: e.currentPosition,
          currentDurationSec: xAxis,
        };
      });
    });

    // console.log(audioState);
    // console.log(uri);
  };
  const onStopRecord = async (): Promise<void> => {
    await audioRecorderPlayer.current.stopRecorder();
    audioRecorderPlayer.current.removeRecordBackListener();
    setAudioState(prev => {
      return { ...prev, recordMetering: 0, currentDurationSec: 0 };
    });
    setPoints([...initVoicePosition]);
  };
  useEffect(() => {
    return () => {
      onStopRecord();
      audioRecorderPlayer.current.removePlayBackListener();
    };
  }, []);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(100, { duration: 5000 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const scrollRef = useRef<any>(null);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (audioState.currentDurationSec) {
      const audioStateRecordMetering =
        // 50 - audioState.recordMetering >= 100
        //   ? 100
        //   : 50 - audioState.recordMetering;
        100 + audioState.recordMetering <= 50
          ? 50
          : 100 + audioState.recordMetering >= 80
          ? 80
          : 100 + audioState.recordMetering;
      // -50 -> 50  -50 150
      // -25 -> 75  -25 125
      // 0 -> 100    0  100
      // 25 -> 125
      // 50 -> 150
      // console.log('----->', audioState.recordMetering);
      let rate = 50;
      const xAxis = audioState.currentDurationSec * rate;
      rate = xAxis > 5000 ? Math.ceil(xAxis / 5000) * rate : rate;
      setCurrentWidth(xAxis);
      setPoints(prev => {
        return [
          ...prev,
          {
            x: xAxis,
            y: coverVoiceToHeight(xAxis, 0, audioStateRecordMetering, 7.5, 16),
          },
        ];
      });
      timer.current = setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
        clearTimeout(timer.current);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioState.currentDurationSec]);

  return (
    <>
      <TouchableOpacity onPress={onStartRecord}>
        <Text style={{ color: 'black', fontSize: 30 }}>点我录音</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onStopRecord}>
        <Text style={{ color: 'black', fontSize: 30 }}>停止录音</Text>
      </TouchableOpacity>
      <View style={{ width: '100%', height: 300 }}>
        <ScrollView
          style={{
            flex: 1,
          }}
          horizontal
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
          ref={scrollRef}>
          <View
            style={{
              width: currentWidth,
              height: 300,
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Wave
              width={currentWidth}
              height={150}
              points={points}
              color="blue"
            />
            <Wave
              width={currentWidth}
              height={150}
              points={points}
              color="blue"
              placement="top"
            />
          </View>
        </ScrollView>
      </View>

      <Text style={{ color: 'black', fontSize: 30 }}>
        {audioState.currentDurationSec ?? 0}
        {audioState.recordMetering}
      </Text>
    </>
  );
};
export default AudioRecorderPlayerWithWave;
