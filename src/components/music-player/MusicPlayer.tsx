import { useSetupPlayer } from '@hooks/useSetupPlayer';
import React from 'react';
import { View } from 'react-native';

import MusicPlayerProgress from './Progress';
import PlayerControls from './PlayerControls';
// import { useActiveTrack } from 'react-native-track-player';
const MusicPlayer = () => {
  // const track = useActiveTrack();
  const isPlayerReady = useSetupPlayer();

  if (!isPlayerReady) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
      }}>
      <MusicPlayerProgress />
      <PlayerControls />
    </View>
  );
};
export default MusicPlayer;
