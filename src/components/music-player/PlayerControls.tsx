import TrackPlayer, {
  isPlaying,
  useIsPlaying,
} from 'react-native-track-player';
import React, { useEffect } from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
const PlayerControls = () => {
  const { playing } = useIsPlaying();
  //   useEffect(async () => {
  //     const tracks = await TrackPlayer.getQueue();
  //     console.log(`First title: ${tracks[0].title}`);
  //   }, []);
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
