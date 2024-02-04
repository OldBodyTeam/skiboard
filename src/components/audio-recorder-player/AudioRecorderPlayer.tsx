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
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Canvas,
  Fill,
  Patch,
  Path,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import dayjs from 'dayjs';
const path = Platform.select({ ios: undefined, android: undefined });
const topPath = Skia.Path.Make();
const bottomPath = Skia.Path.Make();
topPath.moveTo(0, 150);
// topPath.lineTo(30, 150 + 10);
// topPath.lineTo(30, 150 + 10);
// topPath.lineTo(60, 150 + 40);
// topPath.lineTo(90, 150 + 30);
// topPath.lineTo(120, 150 + 100);
bottomPath.moveTo(0, 150);
// bottomPath.lineTo(30, 150 - 10);
// bottomPath.lineTo(60, 150 - 40);
// bottomPath.lineTo(90, 150 - 30);
// bottomPath.lineTo(120, 150 - 100);

const AudioRecorderPlayerWithWave = () => {
  const audioRecorderPlayer = useRef<AudioRecorderPlayer>(
    new AudioRecorderPlayer(),
  );
  const [audioState, setAudioState] = useState({
    recordMetering: 0,
    currentPositionSec: 0,
    currentDurationSec: 0,
  });
  const [a, setA] = useState(0);
  useEffect(() => {
    if (!audioRecorderPlayer.current) {
      audioRecorderPlayer.current = new AudioRecorderPlayer();
    }
    audioRecorderPlayer.current.setSubscriptionDuration(0.1);
  }, []);
  const [currentWidth, setCurrentWidth] = useState(1);
  const [yAxis, setYAxis] = useState(0);
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

    const uri = await audioRecorderPlayer.current.startRecorder(
      path,
      audioSet,
      true,
    );
    // topPath.lineTo(30, 150 + 10);
    // topPath.lineTo(30, 150 + 10);
    // topPath.lineTo(60, 150 + 40);
    // topPath.lineTo(90, 150 + 30);
    // topPath.lineTo(120, 150 + 100);

    audioRecorderPlayer.current.addRecordBackListener((e: RecordBackType) => {
      console.log(e);
      const xAxis = Math.floor(e.currentPosition / 1000);
      setCurrentWidth(xAxis);
      //   topPath.lineTo(xAxis * 30, Math.floor(150 - 30));
      //   bottomPath.lineTo(xAxis * 30, Math.floor(150 + 30));
      //   topPath.lineTo(30, 150 + 10);
      //   topPath.lineTo(30, 150 + 10);
      //   topPath.lineTo(60, 150 + 40);
      //   topPath.lineTo(90, 150 + 30);
      //   topPath.lineTo(120, 150 + 100);
      //   topPath.lineTo(xAxis * 30, 150);
      //   topPath.lineTo(0, 150);
      //   bottomPath.lineTo(xAxis * 30, 150);
      //   bottomPath.lineTo(0, 150);
      setAudioState(prev => {
        return {
          ...prev,
          recordMetering: e.currentMetering ?? 0,
          currentPositionSec: e.currentPosition,
          currentDurationSec: xAxis,
        };
      });
    });

    console.log(audioState);
    console.log(uri);
  };
  const onStopRecord = async (): Promise<void> => {
    const result = await audioRecorderPlayer.current.stopRecorder();
    audioRecorderPlayer.current.removeRecordBackListener();
    // setAudioState(prev => {
    //   return { ...prev, recordMetering: 0, currentDurationSec: 0 };
    // });
    topPath.lineTo(currentWidth, 150);
    topPath.lineTo(0, 150);
    bottomPath.lineTo(currentWidth, 150);
    bottomPath.lineTo(0, 150);
    topPath.close();
    console.log(result);
  };
  useEffect(() => {
    return () => {
      onStopRecord();
      audioRecorderPlayer.current.removePlayBackListener();
    };
  }, []);

  return (
    <>
      <TouchableOpacity onPress={onStartRecord}>
        <Text style={{ color: 'white', fontSize: 30 }}>点我录音</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={onStopRecord}>
        <Text style={{ color: 'white', fontSize: 30 }}>停止录音</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          topPath.lineTo(100, 150);
        }}>
        <Text style={{ color: 'white', fontSize: 30 }}>停止录音</Text>
      </TouchableOpacity>
      <ScrollView horizontal style={{ width: 400, height: 300 }}>
        <Canvas style={{ width: 400, height: 300, backgroundColor: 'white' }}> */}
      {/* <Path
            path={topPath}
            style="stroke"
            strokeWidth={2}
            color="red"
            strokeJoin="round"
            strokeCap="round"
            fillType={'evenOdd'}
          /> */}
      {/* <Path path={topPath} color="lightblue" fillType="evenOdd" />
          <Path path={bottomPath} color="lightblue" fillType="evenOdd" />
          <Path path="M 10 80 Q 52.5 10, 95 80 T 180 80" color="black" />
        </Canvas>
      </ScrollView>
      <Text style={{ color: 'white', fontSize: 30 }}>
        {audioState.currentDurationSec ?? 0}
      </Text>
      <Text style={{ color: 'white', fontSize: 30 }}>{a ?? 0}</Text> */}
    </>
  );
};
export default AudioRecorderPlayerWithWave;
