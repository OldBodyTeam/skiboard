import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import { FFmpegKitConfig, FFprobeKit } from 'ffmpeg-kit-react-native';
const PlayerControls = () => {
  const { playing } = useIsPlaying();
  FFprobeKit.getMediaInformation(
    'https://gd-hbimg.huaban.com/760a4c0d08015c68c5da35863dd60490560cc0cd849d0-4YRCfk_fw240webp',
  ).then(async session => {
    const information = await session.getMediaInformation();
    console.log('xxxxxxxxxx', information);
    if (information === undefined) {
      // CHECK THE FOLLOWING ATTRIBUTES ON ERROR
      const state = FFmpegKitConfig.sessionStateToString(
        await session.getState(),
      );
      const returnCode = await session.getReturnCode();
      const failStackTrace = await session.getFailStackTrace();
      const duration = await session.getDuration();
      const output = await session.getOutput();
    }
  });
  return (
    <TouchableWithoutFeedback
      onPress={playing ? TrackPlayer.pause : TrackPlayer.play}>
      <View
        style={{
          width: 55,
          height: 55,
          borderRadius: 50,
          marginLeft: 15,
          backgroundColor: 'yellow',
        }}>
        <Image
          source={
            playing
              ? require('../../assets/sound-effects/pause.png')
              : require('../../assets/sound-effects/play.png')
          }
          style={{ width: 55, height: 55 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default PlayerControls;
