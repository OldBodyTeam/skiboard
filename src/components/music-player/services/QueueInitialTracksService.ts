import TrackPlayer, { Track } from 'react-native-track-player';

import { playlistData } from '../assets/playlist.ts';

export const QueueInitialTracksService = async (): Promise<void> => {
  await TrackPlayer.add([...(playlistData as Track[])]);
};
