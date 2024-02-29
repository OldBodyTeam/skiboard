import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
const PlayerControls = () => {
  const { playing } = useIsPlaying();
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
