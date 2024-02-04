import { QueueInitialTracksService } from '@components/music-player/services/QueueInitialTracksService';
import { SetupService } from '@components/music-player/services/SetupService';
import { useState, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';

const useSetupPlayer = () => {
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await SetupService();
      if (unmounted) {
        return;
      }
      const queue = await TrackPlayer.getQueue();
      if (unmounted) {
        return;
      }
      if (queue.length <= 0) {
        await QueueInitialTracksService();
      }
      setPlayerReady(true);
    })();
    return () => {
      unmounted = true;
    };
  }, []);
  return playerReady;
};
export { useSetupPlayer };
