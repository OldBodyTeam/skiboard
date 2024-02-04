import React from 'react';
import { StyleSheet } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { Slider, Text, View } from 'react-native-ui-lib';

const MusicPlayerProgress = () => {
  const { position, duration } = useProgress();
  // console.log('&&&&', position, duration);
  return (
    <View style={styles.container}>
      <Slider
        style={{ ...styles.slider }}
        value={position}
        minimumValue={0}
        maximumValue={duration === 0 ? 1 : duration}
        thumbTintColor="#FFFFFF"
        minimumTrackTintColor="#FCE500"
        maximumTrackTintColor="#FFFFFF"
        thumbStyle={{ width: 15, height: 15 }}
        onValueChange={TrackPlayer.seekTo}
      />
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{formatSeconds(position)}</Text>
        <Text style={styles.labelText}>{formatSeconds(duration)}</Text>
      </View>
    </View>
  );
};
const formatSeconds = (time: number) =>
  new Date(time * 1000).toISOString().slice(14, 19);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: 50,
    justifyContent: 'center',
  },
  slider: {
    height: 40,
    flexDirection: 'row',
    flex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    zIndex: -1,
  },
  labelText: {
    color: 'white',
    fontVariant: ['lining-nums'],
    fontSize: 12,
    opacity: 0.25,
  },
});
export default MusicPlayerProgress;
